import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/adminAuth";
import { sql } from "@/lib/db";

export async function GET(req: NextRequest) {
  if (!await checkAdminAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const configs = await sql`SELECT key, value, description, updated_at FROM system_config ORDER BY key`;
  return NextResponse.json({ configs });
}

export async function PATCH(req: NextRequest) {
  if (!await checkAdminAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { key, value } = await req.json();
  if (!key || value === undefined) return NextResponse.json({ error: "key and value required" }, { status: 400 });

  await sql`
    UPDATE system_config SET value = ${String(value)}, updated_at = NOW()
    WHERE key = ${key}
  `;
  return NextResponse.json({ ok: true });
}
