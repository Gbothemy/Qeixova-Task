import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [topEarners, topQLT, currentUser] = await Promise.all([
    // Top 10 by approved completions this month
    sql`
      SELECT
        u.id, u.full_name,
        l.level_number, l.name AS level_name, l.badge_color,
        u.xp, u.streak,
        COUNT(c.id)::int AS missions_completed,
        COALESCE(SUM(c.qlt_awarded), 0)::int AS total_qlt_earned
      FROM users u
      LEFT JOIN completions c ON c.user_id = u.id AND c.status = 'approved'
        AND c.completed_at >= date_trunc('month', NOW())
      LEFT JOIN levels l ON l.id = u.level_id
      GROUP BY u.id, l.level_number, l.name, l.badge_color
      ORDER BY missions_completed DESC, total_qlt_earned DESC
      LIMIT 10
    `,
    // Top 10 by total QLT progress all time
    sql`
      SELECT
        u.id, u.full_name,
        l.level_number, l.name AS level_name, l.badge_color,
        u.xp, u.total_xp_earned, u.streak
      FROM users u
      LEFT JOIN levels l ON l.id = u.level_id
      ORDER BY u.total_xp_earned DESC
      LIMIT 10
    `,
    // Current user's rank
    sql`
      SELECT rank FROM (
        SELECT u.id,
          RANK() OVER (ORDER BY COUNT(c.id) DESC) AS rank
        FROM users u
        LEFT JOIN completions c ON c.user_id = u.id AND c.status = 'approved'
          AND c.completed_at >= date_trunc('month', NOW())
        GROUP BY u.id
      ) ranked
      WHERE id = ${session.userId}
    `,
  ]);

  return NextResponse.json({
    topEarners,
    topXP: topQLT,
    topQLT,
    myRank: currentUser[0]?.rank ?? null,
  });
}
