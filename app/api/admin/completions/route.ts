import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/adminAuth";
import { sql } from "@/lib/db";

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
        u.id AS user_id, u.full_name AS user_name, u.email,
        t.title AS task_title, t.proof_type, t.category, t.reward
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

  // Get completion details
  const rows = await sql`
    SELECT c.*, t.reward, u.referred_by
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

    // Update status
    await sql`UPDATE completions SET status = 'approved', rejection_reason = NULL WHERE id = ${completionId}`;

    // If was pending (not yet credited), credit the user now
    if (completion.status === "pending") {
      await sql`UPDATE users SET balance = balance + ${completion.reward} WHERE id = ${completion.user_id}`;
      await sql`
        INSERT INTO transactions (user_id, type, amount, label)
        VALUES (${completion.user_id}, 'credit', ${completion.reward}, ${"Task Approved: " + completion.task_title})
      `;

      // Credit 10% referral bonus
      if (completion.referred_by) {
        const bonus = Math.floor(completion.reward * 0.1);
        await sql`UPDATE users SET balance = balance + ${bonus} WHERE id = ${completion.referred_by}`;
        await sql`
          INSERT INTO transactions (user_id, type, amount, label)
          VALUES (${completion.referred_by}, 'credit', ${bonus}, 'Referral Earnings (10%)')
        `;
      }

      // Update approved count and trust level
      await sql`UPDATE users SET approved_count = approved_count + 1 WHERE id = ${completion.user_id}`;
      // Trust tier: new → trusted after 5 approvals with low rejection rate
      const userStats = await sql`SELECT approved_count, rejected_count FROM users WHERE id = ${completion.user_id}`;
      const { approved_count, rejected_count } = userStats[0];
      const total = approved_count + rejected_count;
      const rejectionRate = total > 0 ? rejected_count / total : 0;
      if (approved_count >= 5 && rejectionRate < 0.3) {
        await sql`UPDATE users SET trust_level = 'trusted' WHERE id = ${completion.user_id}`;
      }
      if (approved_count >= 20 && rejectionRate < 0.1) {
        await sql`UPDATE users SET trust_level = 'verified' WHERE id = ${completion.user_id}`;
      }
    }

    return NextResponse.json({ ok: true, message: "Approved and QLT credited" });
  }

  if (action === "reject") {
    const reason = rejectionReason?.trim() || "Task not completed correctly";
    await sql`UPDATE completions SET status = 'rejected', rejection_reason = ${reason} WHERE id = ${completionId}`;
    // Update rejected count and trust level
    await sql`UPDATE users SET rejected_count = rejected_count + 1 WHERE id = ${completion.user_id}`;
    // Downgrade trust if rejection rate is too high
    const userStats = await sql`SELECT approved_count, rejected_count FROM users WHERE id = ${completion.user_id}`;
    const { approved_count, rejected_count } = userStats[0];
    const total = approved_count + rejected_count;
    const rejectionRate = total > 0 ? rejected_count / total : 0;
    if (rejectionRate >= 0.5 && total >= 4) {
      await sql`UPDATE users SET trust_level = 'flagged' WHERE id = ${completion.user_id}`;
    }
    return NextResponse.json({ ok: true, message: "Rejected" });
  }
}
