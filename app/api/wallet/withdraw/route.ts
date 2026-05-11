import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";
import { sendWithdrawalRequestedEmail } from "@/lib/email";
import { canWithdraw } from "@/lib/missionEngine";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { amount, bank } = await req.json();
  const amt = Number(amount);

  if (!amt || amt < 10000) {
    return NextResponse.json({ error: "Minimum withdrawal is 10,000 QLT (₦100)" }, { status: 400 });
  }
  if (!bank) {
    return NextResponse.json({ error: "Bank account required" }, { status: 400 });
  }

  // Check withdrawal eligibility (Bronze level required)
  const { allowed, totalEarned, needed } = await canWithdraw(session.userId);
  if (!allowed) {
    return NextResponse.json({
      error: `Withdrawals unlock at Bronze level. You need ${needed.toLocaleString()} more QLT lifetime earnings. Currently at ${totalEarned.toLocaleString()} QLT.`,
      needed,
      totalEarned,
    }, { status: 403 });
  }

  const userRows = await sql`SELECT balance FROM users WHERE id = ${session.userId}`;
  if (userRows[0].balance < amt) {
    return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
  }

  // Extract account number from the selected bank option value "BankName — AccountNumber"
  // and look up full details from bank_accounts table
  const rawAccountNumber = bank.split("—")[1]?.trim().replace(/\s/g, "") ?? "";
  const bankRows = rawAccountNumber
    ? await sql`
        SELECT bank_name, account_number, account_name
        FROM bank_accounts
        WHERE user_id = ${session.userId} AND account_number = ${rawAccountNumber}
      `
    : [];

  // Build a rich label with full bank details for admin visibility
  const bankLabel = bankRows.length > 0
    ? `${bankRows[0].bank_name} | Acct: ${bankRows[0].account_number} | Name: ${bankRows[0].account_name}`
    : bank;

  await sql`UPDATE users SET balance = balance - ${amt} WHERE id = ${session.userId}`;
  await sql`
    INSERT INTO transactions (user_id, type, amount, label, status)
    VALUES (${session.userId}, 'debit', ${amt}, ${"Withdrawal to " + bankLabel}, 'pending')
  `;

  const updated = await sql`SELECT balance, email, full_name FROM users WHERE id = ${session.userId}`;
  // Send withdrawal confirmation email (non-blocking)
  sendWithdrawalRequestedEmail(updated[0].email, updated[0].full_name, amt, bankLabel).catch(() => {});
  return NextResponse.json({ ok: true, newBalance: updated[0].balance });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { transactionId, status } = await req.json();
  if (!["completed", "failed"].includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  await sql`UPDATE transactions SET status = ${status} WHERE id = ${transactionId} AND user_id = ${session.userId}`;
  if (status === "failed") {
    const tx = await sql`SELECT amount FROM transactions WHERE id = ${transactionId}`;
    if (tx.length > 0) {
      await sql`UPDATE users SET balance = balance + ${tx[0].amount} WHERE id = ${session.userId}`;
    }
  }
  return NextResponse.json({ ok: true });
}
