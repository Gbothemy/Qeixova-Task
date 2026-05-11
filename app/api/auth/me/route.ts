import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await sql`
    SELECT
      u.id, u.email, u.full_name, u.balance, u.streak, u.referral_code,
      u.xp, u.trust_score, u.daily_earned, u.approved_count, u.rejected_count,
      u.created_at,
      l.level_number, l.name AS level_name, l.badge_color,
      l.daily_cap_qlt, l.xp_required AS next_level_xp,
      l.unlock_features
    FROM users u
    LEFT JOIN levels l ON l.id = u.level_id
    WHERE u.id = ${session.userId}
  `;
  if (rows.length === 0) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const user = rows[0];

  // Get next level info for progress bar
  const nextLevelRows = await sql`
    SELECT level_number, name, xp_required
    FROM levels
    WHERE level_number = ${(user.level_number ?? 1) + 1}
    LIMIT 1
  `;
  const nextLevel = nextLevelRows[0] ?? null;

  // Get claimed milestones count
  const milestoneRows = await sql`
    SELECT COUNT(*)::int AS claimed FROM user_milestones WHERE user_id = ${session.userId}
  `;

  return NextResponse.json({
    user: {
      ...user,
      level: user.level_number ?? 1,
      levelName: user.level_name ?? "Starter",
      badgeColor: user.badge_color ?? "#888888",
      nextLevel: nextLevel ? {
        number: nextLevel.level_number,
        name: nextLevel.name,
        xpRequired: nextLevel.xp_required,
      } : null,
      milestonesClaimed: milestoneRows[0]?.claimed ?? 0,
    },
  });
}
