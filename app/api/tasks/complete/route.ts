import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";
import { verifyProof } from "@/lib/verifyProof";
import { checkDailyCap, updateStreak, XP_REWARDS } from "@/lib/missionEngine";
import { checkRateLimit, incrementRateLimit, checkDuplicate, checkTrustScore } from "@/lib/antiFraud";
import { log } from "@/lib/auditLog";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const { taskId } = body;
    const proofValue = typeof body.proofValue === "string" ? body.proofValue : "";
    if (!taskId) return NextResponse.json({ error: "taskId required" }, { status: 400 });

    // ── Anti-fraud: rate limit ────────────────────────────────────────────
    const { allowed: rateOk, remaining } = await checkRateLimit(session.userId);
    if (!rateOk) {
      await log(session.userId, "rate_limit_hit", { taskId, remaining }, "task", taskId);
      return NextResponse.json({
        error: `You've submitted too many missions this hour. Please wait before trying again.`,
      }, { status: 429 });
    }

    // ── Anti-fraud: trust score ───────────────────────────────────────────
    const { allowed: trustOk, trustScore } = await checkTrustScore(session.userId);
    if (!trustOk) {
      await log(session.userId, "fraud_flagged", { taskId, trustScore }, "task", taskId);
      return NextResponse.json({
        error: `Your account has been flagged due to a high rejection rate (trust score: ${trustScore}%). Please contact support.`,
      }, { status: 403 });
    }

    // ── Duplicate check (application layer) ──────────────────────────────
    const isDuplicate = await checkDuplicate(session.userId, taskId);
    if (isDuplicate) {
      return NextResponse.json({ error: "You have already completed this mission." }, { status: 409 });
    }

    const taskRows = await sql`
      SELECT *
      FROM tasks
      WHERE id = ${taskId}
        AND is_active = true
        AND COALESCE(status, 'active') = 'active'
    `;
    if (taskRows.length === 0) return NextResponse.json({ error: "Mission not found or no longer active." }, { status: 404 });

    const task = taskRows[0];
    const proofType = task.proof_type ?? "none";

    if (proofType !== "none" && !proofValue) {
      return NextResponse.json({ error: "Proof of completion is required." }, { status: 400 });
    }

    // ── Verify proof ──────────────────────────────────────────────────────
    const verification = await verifyProof(proofType, proofValue ?? "", task.title);
    if (!verification.valid) {
      return NextResponse.json({ error: verification.reason }, { status: 422 });
    }

    // ── Budget check ──────────────────────────────────────────────────────
    const budget = Number(task.total_budget ?? 0);
    const budgetUsed = Number(task.budget_used ?? 0);
    if (budget > 0 && budgetUsed + Number(task.reward) > budget) {
      return NextResponse.json({ error: "This mission has reached its completion limit." }, { status: 410 });
    }

    // ── Daily cap check ───────────────────────────────────────────────────
    const { allowed: capOk } = await checkDailyCap(session.userId, task.reward);
    if (!capOk) {
      return NextResponse.json({
        error: `Daily earning limit reached. Complete more missions tomorrow or level up to increase your cap.`,
      }, { status: 429 });
    }

    // ── Min level check ───────────────────────────────────────────────────
    const minLevel = Number(task.min_level ?? 1);
    const userLevelRows = await sql`
      SELECT l.level_number, l.unlock_features
      FROM users u
      LEFT JOIN levels l ON l.id = u.level_id
      WHERE u.id = ${session.userId}
    `;
    const userLevel = Number(userLevelRows[0]?.level_number ?? 1);
    if (userLevel < minLevel) {
      return NextResponse.json({ error: `This mission requires Level ${minLevel}.` }, { status: 403 });
    }

    const unlockFeatures: string[] = (userLevelRows[0]?.unlock_features as string[]) ?? ["engagement_missions"];
    const allowedTypes = new Set<string>();
    if (unlockFeatures.includes("engagement_missions")) allowedTypes.add("engagement");
    if (unlockFeatures.includes("participation_missions")) allowedTypes.add("participation");
    if (unlockFeatures.includes("premium_missions")) allowedTypes.add("premium");
    const missionType = task.mission_type ?? "engagement";
    if (!allowedTypes.has(missionType)) {
      return NextResponse.json({ error: "This mission type is not unlocked for your level yet." }, { status: 403 });
    }

    const storedProof = proofValue?.startsWith("data:image") ? "[screenshot uploaded]" : (proofValue ?? null);
    const xpReward = Number(task.xp_reward ?? XP_REWARDS[missionType] ?? 10);

    // ── Insert completion (DB UNIQUE constraint is final guard) ───────────
    try {
      await sql`
        INSERT INTO completions (user_id, task_id, proof_value, status, xp_awarded, qlt_awarded)
        VALUES (${session.userId}, ${taskId}, ${storedProof}, 'pending', ${xpReward}, ${task.reward})
      `;
    } catch (err: unknown) {
      // Catch DB unique violation
      if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "23505") {
        return NextResponse.json({ error: "You have already completed this mission." }, { status: 409 });
      }
      throw err;
    }

    // ── Increment rate limit counter ──────────────────────────────────────
    await incrementRateLimit(session.userId);

    // ── Budget tracking ───────────────────────────────────────────────────
    if (budget > 0) {
      await sql`UPDATE tasks SET budget_used = LEAST(total_budget, budget_used + ${task.reward}) WHERE id = ${taskId}`;
      await sql`UPDATE tasks SET is_active = FALSE WHERE id = ${taskId} AND total_budget > 0 AND budget_used >= total_budget`;
    }

    // ── Streak update ─────────────────────────────────────────────────────
    const { newStreak } = await updateStreak(session.userId);

    // ── Audit log ─────────────────────────────────────────────────────────
    await log(session.userId, "mission_submitted", {
      taskId, missionType, xpReward, reward: task.reward, newStreak,
    }, "task", taskId);

    return NextResponse.json({
      ok: true,
      pending: true,
      reward: task.reward,
      xpReward,
      missionType,
      newStreak,
      message: "Submission received. Your QLT and XP will be credited after review.",
    });

  } catch (err) {
    console.error("Mission complete error:", err);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
