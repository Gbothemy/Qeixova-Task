import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/adminAuth";
import { sql } from "@/lib/db";

export async function GET(req: NextRequest) {
  if (!await checkAdminAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page      = Math.max(1, Number(searchParams.get("page") ?? 1));
  const userId    = searchParams.get("user_id") ?? "";
  const eventType = searchParams.get("event_type") ?? "";
  const limit     = 50;
  const offset    = (page - 1) * limit;

  const [logs, countRows] = await Promise.all([
    sql`
      SELECT a.id, a.event_type, a.entity_type, a.entity_id, a.data, a.created_at,
        u.full_name AS user_name, u.email
      FROM audit_logs a
      LEFT JOIN users u ON u.id = a.user_id
      WHERE (${userId} = '' OR a.user_id = ${userId === "" ? 0 : Number(userId)})
        AND (${eventType} = '' OR a.event_type = ${eventType})
      ORDER BY a.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `,
    sql`
      SELECT COUNT(*)::int AS total FROM audit_logs
      WHERE (${userId} = '' OR user_id = ${userId === "" ? 0 : Number(userId)})
        AND (${eventType} = '' OR event_type = ${eventType})
    `,
  ]);

  return NextResponse.json({ logs, total: countRows[0].total });
}
