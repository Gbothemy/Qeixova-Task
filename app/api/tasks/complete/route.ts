import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";
import { verifyProof } from "@/lib/verifyProof";
import { checkDailyCap, updateStreak, XP_REWARDS } from "@/lib/missionEngine";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const { taskId, proofValue } = body;
    if (!taskId) return NextResponse.json({ error: "taskId required" }, { status: 400 });

    const taskRows = await sql`SELECT * FROM tasks WHERE id = ${taskId} AND is_active = true`;
    if (taskRows.length === 0) return NextResponse.json({ error: "Task not found" }, { status: 404 });

    const task = taskRows[0];
    const proofType = task.proof_type ?? "none";

    if (proofType !== "none" && !proofValue) {
      return NextResponse.json({ error: "Proof of completion is required" }, { status: 400 });
    }

    // Verify proof
    const verification = await verifyProof(proofType, proofValue ?? "", task.title);
    if (!verification.valid) {
      return NextResponse.json({ error: verification.reason }, { status: 422 });
    }

    // Duplicate check
    const already = await sql`
      SELECT id FROM completions WHERE user_id = ${session.userId} AND task_id = ${taskId}
    `;
    if (already.length > 0) {
      return NextResponse.json({ error: "You have already completed this task." }, { status: 409 });
    }

    // Budget check
    const budget = Number(task.total_budget ?? 0);
    const budgetUsed = Number(task.budget_used ?? 0);
    if (budget > 0 && budgetUsed >= budget) {
      return NextResponse.json({ error: "This mission has reached its completion limit." }, { status: 410 });
    }

    // Daily cap check
    const { allowed, remaining } = await checkDailyCap(session.userId, task.reward);
    if (!allowed) {
      return NextResponse.json({
        error: `Daily earning limit reached. You can earn up to ${remaining} more QLT today. Complete more missions tomorrow or level up to increase your cap.`,
      }, { status: 429 });
    }

    // Min level check
    const minLevel = Number(task.min_level ?? 1);
    if (minLevel > 1) {
      const userRows = await sql`SELECT level_id FROM users WHERE id = ${session.userId}`;
      const userLevelId = Number(userRows[0]?.level_id ?? 1);
      const levelRows = await sql`SELECT level_number FROM levels WHERE id = ${userLevelId}`;
      const userLevelNum = Number(levelRows[0]?.level_number ?? 1);
      if (userLevelNum < minLevel) {
        return NextResponse.json({ error: `This mission requires Level ${minLevel}. Keep completing missions to level up.` }, { status: 403 });
      }
    }

    const storedProof = proofValue?.startsWith("data:image")
      ? "[screenshot uploaded]"
      : (proofValue ?? null);

    const missionType = task.mission_type ?? "engagement";
    const xpReward = task.xp_reward ?? XP_REWARDS[missionType] ?? 10;

    // Insert completion (pending admin approval)
    await sql`
      INSERT INTO completions (user_id, task_id, proof_value, status, xp_awarded, qlt_awarded)
      VALUES (${session.userId}, ${taskId}, ${storedProof}, 'pending', ${xpReward}, ${task.reward})
    `;

    // Increment budget_used
    if (budget > 0) {
      await sql`UPDATE tasks SET budget_used = budget_used + ${task.reward} WHERE id = ${taskId}`;
      await sql`
        UPDATE tasks SET is_active = FALSE
        WHERE id = ${taskId} AND total_budget > 0 AND budget_used >= total_budget
      `;
    }

    // Update streak on submission
    const { newStreak } = await updateStreak(session.userId);

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
