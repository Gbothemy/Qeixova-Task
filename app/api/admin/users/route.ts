import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/adminAuth";
import { sql } from "@/lib/db";

export async function GET(req: NextRequest) {
  if (!await checkAdminAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "";
  const page   = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit  = 20;
  const offset = (page - 1) * limit;

  const [users, countRows] = await Promise.all([
    search
      ? sql`
          SELECT u.id, u.full_name, u.email, u.balance, u.created_at, u.banned,
            u.xp, u.trust_score, u.streak, u.approved_count, u.rejected_count,
            l.level_number, l.name AS level_name, l.badge_color,
            COUNT(c.id)::int AS tasks_completed
          FROM users u
          LEFT JOIN completions c ON c.user_id = u.id AND c.status = 'approved'
          LEFT JOIN levels l ON l.id = u.level_id
          WHERE u.full_name ILIKE ${"%" + search + "%"} OR u.email ILIKE ${"%" + search + "%"}
          GROUP BY u.id, l.level_number, l.name, l.badge_color
          ORDER BY u.created_at DESC
          LIMIT ${limit} OFFSET ${offset}
        `
      : sql`
          SELECT u.id, u.full_name, u.email, u.balance, u.created_at, u.banned,
            u.xp, u.trust_score, u.streak, u.approved_count, u.rejected_count,
            l.level_number, l.name AS level_name, l.badge_color,
            COUNT(c.id)::int AS tasks_completed
          FROM users u
          LEFT JOIN completions c ON c.user_id = u.id AND c.status = 'approved'
          LEFT JOIN levels l ON l.id = u.level_id
          GROUP BY u.id, l.level_number, l.name, l.badge_color
          ORDER BY u.created_at DESC
          LIMIT ${limit} OFFSET ${offset}
        `,
    search
      ? sql`SELECT COUNT(*)::int AS total FROM users WHERE full_name ILIKE ${"%" + search + "%"} OR email ILIKE ${"%" + search + "%"}`
      : sql`SELECT COUNT(*)::int AS total FROM users`,
  ]);

  return NextResponse.json({ users, total: countRows[0].total });
}

export async function PATCH(req: NextRequest) {
  if (!await checkAdminAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, action, value } = await req.json();
  if (!id || !action) return NextResponse.json({ error: "id and action required" }, { status: 400 });

  if (action === "ban") {
    await sql`UPDATE users SET banned = TRUE WHERE id = ${id}`;
  } else if (action === "unban") {
    await sql`UPDATE users SET banned = FALSE WHERE id = ${id}`;
  } else if (action === "set_trust_score") {
    const score = Math.max(0, Math.min(100, Number(value)));
    await sql`UPDATE users SET trust_score = ${score} WHERE id = ${id}`;
  } else if (action === "set_level") {
    const levelRows = await sql`SELECT id FROM levels WHERE level_number = ${Number(value)} LIMIT 1`;
    if (levelRows.length > 0) {
      await sql`UPDATE users SET level_id = ${levelRows[0].id} WHERE id = ${id}`;
    }
  } else if (action === "reset_trust") {
    await sql`UPDATE users SET trust_score = 100, approved_count = 0, rejected_count = 0 WHERE id = ${id}`;
  } else {
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
