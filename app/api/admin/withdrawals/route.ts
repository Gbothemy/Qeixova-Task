import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/adminAuth";
import { sql } from "@/lib/db";

export async function GET(req: NextRequest) {
  if (!await checkAdminAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const withdrawals = status
    ? await sql`
        SELECT t.id, t.amount, t.label, t.status, t.created_at,
          u.full_name AS user_name, u.email
        FROM transactions t
        JOIN users u ON u.id = t.user_id
        WHERE t.type = 'debit' AND t.status = ${status}
        ORDER BY t.created_at DESC
        LIMIT 100
      `
    : await sql`
        SELECT t.id, t.amount, t.label, t.status, t.created_at,
          u.full_name AS user_name, u.email
        FROM transactions t
        JOIN users u ON u.id = t.user_id
        WHERE t.type = 'debit'
        ORDER BY t.created_at DESC
        LIMIT 100
      `;

  return NextResponse.json({ withdrawals });
}

export async function PATCH(req: NextRequest) {
  if (!await checkAdminAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, action } = await req.json();
  if (!id || !action) return NextResponse.json({ error: "id and action required" }, { status: 400 });

  if (action === "approve") {
    await sql`UPDATE transactions SET status = 'completed' WHERE id = ${id} AND type = 'debit'`;
  } else if (action === "processing") {
    await sql`UPDATE transactions SET status = 'processing' WHERE id = ${id} AND type = 'debit'`;
  } else if (action === "reject") {
    // Refund QLT to user
    const rows = await sql`SELECT user_id, amount FROM transactions WHERE id = ${id} AND type = 'debit'`;
    if (rows.length > 0) {
      const { user_id, amount } = rows[0];
      await sql`UPDATE transactions SET status = 'failed' WHERE id = ${id}`;
      await sql`UPDATE users SET balance = balance + ${amount} WHERE id = ${user_id}`;
      await sql`
        INSERT INTO transactions (user_id, type, amount, label, status)
        VALUES (${user_id}, 'credit', ${amount}, 'Withdrawal Refund', 'completed')
      `;
    }
  } else {
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
