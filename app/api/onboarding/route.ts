import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await sql`SELECT onboarding_completed FROM users WHERE id = ${session.userId}`;
  return NextResponse.json({ onboarding_completed: rows[0]?.onboarding_completed ?? false });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { bank_name, account_number, account_name } = await req.json();

  // Save bank account if provided
  if (bank_name && account_number && account_name) {
    await sql`
      INSERT INTO bank_accounts (user_id, bank_name, account_number, account_name, is_default)
      VALUES (${session.userId}, ${bank_name}, ${account_number}, ${account_name}, TRUE)
      ON CONFLICT (user_id, account_number) DO NOTHING
    `;
  }

  // Mark onboarding complete
  await sql`UPDATE users SET onboarding_completed = TRUE WHERE id = ${session.userId}`;

  return NextResponse.json({ ok: true });
}
