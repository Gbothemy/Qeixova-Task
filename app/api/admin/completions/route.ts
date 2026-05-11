import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/adminAuth";
import { sql } from "@/lib/db";
import { awardXP, checkMilestones, updateTrustScore } from "@/lib/missionEngine";

export async function GET(req: NextRequest) {
  if (!await checkAdminAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page      = Math.max(1, Number(searchParams.get("page") ?? 1));
  const proofType = searchParams.get("proof_type") ?? "";
  const status    = searchParams.get("status") ?? "";
  const limit     = 30;
  const offset    = (page - 1) * limit;

  const [completions, countRows] = await Promise.all([
    sql`
      SELECT c.id, c.proof_value, c.completed_at, c.status, c.rejection_reason,
        c.xp_awarded, c.qlt_awarded,
        u.id AS user_id, u.full_name AS user_name, u.email, u.trust_score,
        t.title AS task_title, t.proof_type, t.category, t.reward,
        t.mission_type, t.xp_reward
      FROM completions c
      JOIN users u ON u.id = c.user_id
      JOIN tasks t ON t.id = c.task_id
      WHERE (${proofType} = '' OR t.proof_type = ${proofType})
        AND (${status} = '' OR c.status = ${status})
      ORDER BY c.completed_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `,
    sql`
      SELECT COUNT(*)::int AS total FROM completions c
      JOIN tasks t ON t.id = c.task_id
      WHERE (${proofType} = '' OR t.proof_type = ${proofType})
        AND (${status} = '' OR c.status = ${status})
    `,
  ]);

  return NextResponse.json({ completions, total: countRows[0].total });
}

export async function PATCH(req: NextRequest) {
  if (!await checkAdminAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { completionId, action, rejectionReason } = await req.json();
  if (!completionId || !["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const rows = await sql`
    SELECT c.*, t.reward, t.mission_type, t.xp_reward, t.title AS task_title,
           u.referred_by
    FROM completions c
    JOIN tasks t ON t.id = c.task_id
    JOIN users u ON u.id = c.user_id
    WHERE c.id = ${completionId}
  `;
  if (rows.length === 0) return NextResponse.json({ error: "Completion not found" }, { status: 404 });

  const completion = rows[0];

  if (action === "approve") {
    if (completion.status === "approved") {
      return NextResponse.json({ error: "Already approved" }, { status: 409 });
    }

    await sql`UPDATE completions SET status = 'approved', rejection_reason = NULL WHERE id = ${completionId}`;

    if (completion.status === "pending") {
      const reward = Number(completion.reward);
      const xpReward = Number(completion.xp_reward ?? completion.xp_awarded ?? 10);

      // Credit QLT balance
      await sql`UPDATE users SET balance = balance + ${reward}, daily_earned = daily_earned + ${reward} WHERE id = ${completion.user_id}`;
      await sql`
        INSERT INTO transactions (user_id, type, amount, label)
        VALUES (${completion.user_id}, 'credit', ${reward}, ${"Mission Approved: " + completion.task_title})
      `;

      // Award XP + level up
      const { newLevel, leveledUp } = await awardXP(completion.user_id, xpReward);

      // Referral bonus (10%)
      if (completion.referred_by) {
        const bonus = Math.floor(reward * 0.1);
        await sql`UPDATE users SET balance = balance + ${bonus} WHERE id = ${completion.referred_by}`;
        await sql`
          INSERT INTO transactions (user_id, type, amount, label)
          VALUES (${completion.referred_by}, 'credit', ${bonus}, 'Referral Earnings (10%)')
        `;
      }

      // Update approved count
      await sql`UPDATE users SET approved_count = approved_count + 1 WHERE id = ${completion.user_id}`;

      // Update trust score
      const { trustScore } = await updateTrustScore(completion.user_id);

      // Check milestones
      const { awarded: milestones } = await checkMilestones(completion.user_id);

      return NextResponse.json({
        ok: true,
        message: "Approved and QLT + XP credited",
        newLevel,
        leveledUp,
        trustScore,
        milestones,
      });
    }

    return NextResponse.json({ ok: true, message: "Approved" });
  }

  if (action === "reject") {
    const reason = rejectionReason?.trim() || "Mission not completed correctly";
    await sql`UPDATE completions SET status = 'rejected', rejection_reason = ${reason} WHERE id = ${completionId}`;
    await sql`UPDATE users SET rejected_count = rejected_count + 1 WHERE id = ${completion.user_id}`;

    const { trustScore } = await updateTrustScore(completion.user_id);

    // Flag user if trust score drops too low
    if (trustScore < 50) {
      await sql`UPDATE users SET trust_level = 'flagged' WHERE id = ${completion.user_id}`;
    }

    return NextResponse.json({ ok: true, message: "Rejected", trustScore });
  }
}
