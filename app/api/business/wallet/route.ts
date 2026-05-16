import { NextRequest, NextResponse } from "next/server";
import { getBusinessSession } from "@/lib/businessAuth";
import { sql } from "@/lib/db";
import { ensureBusinessWalletTables, makeFundingReference } from "@/lib/businessWallet";

export async function GET() {
  const session = await getBusinessSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await ensureBusinessWalletTables();

  const [businessRows, transactions, reservedRows, spentRows] = await Promise.all([
    sql`SELECT balance FROM businesses WHERE id = ${session.businessId}`,
    sql`
      SELECT id, type, amount, label, status, provider, reference, metadata, created_at
      FROM business_transactions
      WHERE business_id = ${session.businessId}
      ORDER BY created_at DESC
      LIMIT 40
    `,
    sql`
      SELECT COALESCE(SUM(GREATEST(total_budget - budget_used, 0)), 0)::int AS reserved
      FROM tasks
      WHERE business_id = ${session.businessId}
        AND COALESCE(task_status, '') <> 'deleted'
        AND total_budget > 0
    `,
    sql`
      SELECT COALESCE(SUM(budget_used), 0)::int AS spent
      FROM tasks
      WHERE business_id = ${session.businessId}
        AND COALESCE(task_status, '') <> 'deleted'
    `,
  ]);

  return NextResponse.json({
    balance: businessRows[0]?.balance ?? 0,
    reserved: reservedRows[0]?.reserved ?? 0,
    spent: spentRows[0]?.spent ?? 0,
    transactions,
  });
}

export async function POST(req: NextRequest) {
  const session = await getBusinessSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await ensureBusinessWalletTables();

  const body = await req.json().catch(() => ({}));
  const amount = Math.round(Number(body.amount));
  const method = body.method === "bank_transfer" ? "bank_transfer" : "paystack";

  if (!Number.isFinite(amount) || amount < 1000) {
    return NextResponse.json({ error: "Minimum funding amount is 1,000 QLT." }, { status: 400 });
  }

  const reference = makeFundingReference(session.businessId);
  const label = method === "bank_transfer" ? "Business wallet funding - bank transfer" : "Business wallet funding - Paystack ready";

  await sql`
    INSERT INTO business_transactions (business_id, type, amount, label, status, provider, reference, metadata)
    VALUES (
      ${session.businessId}, 'credit', ${amount}, ${label}, 'completed',
      ${method}, ${reference},
      ${JSON.stringify({
        paystackReady: method === "paystack",
        note: "Replace this demo credit with Paystack initialization and webhook verification when keys are added.",
      })}
    )
  `;

  await sql`UPDATE businesses SET balance = balance + ${amount} WHERE id = ${session.businessId}`;
  const updated = await sql`SELECT balance FROM businesses WHERE id = ${session.businessId}`;

  return NextResponse.json({
    ok: true,
    reference,
    authorizationUrl: null,
    balance: updated[0]?.balance ?? 0,
    message: method === "paystack"
      ? "Demo funding completed. This endpoint is ready to return a Paystack authorization URL later."
      : "Bank transfer funding recorded.",
  });
}
