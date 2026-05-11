/**
 * Mission Engine — Step 2 Business Logic
 * Handles XP, level progression, daily caps, streaks, milestones.
 * Called from task completion and admin approval routes.
 */
import { sql } from "@/lib/db";

// ── XP per mission type ──────────────────────────────────────────────────────
export const XP_REWARDS: Record<string, number> = {
  engagement:    10,
  participation: 25,
  premium:       50,
};

// ── Calc level from XP ───────────────────────────────────────────────────────
export async function getLevelForXP(xp: number): Promise<{ id: number; level_number: number; name: string; daily_cap_qlt: number; badge_color: string }> {
  const rows = await sql`
    SELECT id, level_number, name, daily_cap_qlt, badge_color
    FROM levels
    WHERE xp_required <= ${xp}
    ORDER BY xp_required DESC
    LIMIT 1
  `;
  return (rows[0] as { id: number; level_number: number; name: string; daily_cap_qlt: number; badge_color: string }) ?? { id: 1, level_number: 1, name: "Starter", daily_cap_qlt: 5000, badge_color: "#888888" };
}

// ── Award XP + update level ──────────────────────────────────────────────────
export async function awardXP(userId: number, xpAmount: number): Promise<{ newXP: number; newLevel: number; leveledUp: boolean }> {
  const before = await sql`SELECT xp, level_id FROM users WHERE id = ${userId}`;
  const oldXP = Number(before[0]?.xp ?? 0);
  const oldLevelId = Number(before[0]?.level_id ?? 1);

  const newXP = oldXP + xpAmount;
  const newLevel = await getLevelForXP(newXP);

  await sql`
    UPDATE users
    SET xp = ${newXP}, total_xp_earned = total_xp_earned + ${xpAmount}, level_id = ${newLevel.id}
    WHERE id = ${userId}
  `;

  return { newXP, newLevel: newLevel.level_number, leveledUp: newLevel.id !== oldLevelId };
}

// ── Check + enforce daily earning cap ────────────────────────────────────────
export async function checkDailyCap(userId: number, rewardAmount: number): Promise<{ allowed: boolean; remaining: number }> {
  const today = new Date().toISOString().split("T")[0];

  // Reset daily counter if it's a new day
  await sql`
    UPDATE users
    SET daily_earned = 0, daily_reset_at = ${today}
    WHERE id = ${userId} AND daily_reset_at < ${today}
  `;

  const rows = await sql`
    SELECT u.daily_earned, l.daily_cap_qlt
    FROM users u
    JOIN levels l ON l.id = u.level_id
    WHERE u.id = ${userId}
  `;

  const { daily_earned, daily_cap_qlt } = rows[0];
  const remaining = Math.max(0, daily_cap_qlt - Number(daily_earned));
  const allowed = remaining >= rewardAmount;

  return { allowed, remaining };
}

// ── Update streak ─────────────────────────────────────────────────────────────
export async function updateStreak(userId: number): Promise<{ newStreak: number }> {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  const rows = await sql`SELECT streak, last_active FROM users WHERE id = ${userId}`;
  const user = rows[0];
  const lastActive = user.last_active ? new Date(user.last_active).toISOString().split("T")[0] : null;

  const newStreak = lastActive === yesterday ? user.streak + 1
    : lastActive === today ? user.streak
    : 1;

  await sql`UPDATE users SET streak = ${newStreak}, last_active = ${today} WHERE id = ${userId}`;
  return { newStreak };
}

// ── Check and award milestones ────────────────────────────────────────────────
export async function checkMilestones(userId: number): Promise<{ awarded: Array<{ name: string; bonus_qlt: number; bonus_xp: number }> }> {
  const awarded: Array<{ name: string; bonus_qlt: number; bonus_xp: number }> = [];

  const userRows = await sql`SELECT xp, total_xp_earned, streak FROM users WHERE id = ${userId}`;
  const user = userRows[0];

  const totalCompletions = await sql`
    SELECT COUNT(*)::int AS total FROM completions WHERE user_id = ${userId} AND status = 'approved'
  `;
  const total = totalCompletions[0].total;

  // Get all unclaimed milestones
  const milestones = await sql`
    SELECT m.* FROM milestones m
    WHERE NOT EXISTS (
      SELECT 1 FROM user_milestones um WHERE um.user_id = ${userId} AND um.milestone_id = m.id
    )
  `;

  for (const m of milestones) {
    let triggered = false;
    if (m.trigger_type === 'total_completions' && total >= m.trigger_value) triggered = true;
    if (m.trigger_type === 'streak' && user.streak >= m.trigger_value) triggered = true;
    if (m.trigger_type === 'total_xp' && user.total_xp_earned >= m.trigger_value) triggered = true;

    if (triggered) {
      // Mark as claimed
      await sql`
        INSERT INTO user_milestones (user_id, milestone_id) VALUES (${userId}, ${m.id})
        ON CONFLICT DO NOTHING
      `;

      // Award bonuses
      if (m.bonus_qlt > 0) {
        await sql`UPDATE users SET balance = balance + ${m.bonus_qlt} WHERE id = ${userId}`;
        await sql`
          INSERT INTO transactions (user_id, type, amount, label)
          VALUES (${userId}, 'credit', ${m.bonus_qlt}, ${'Milestone: ' + m.name})
        `;
      }
      if (m.bonus_xp > 0) {
        await awardXP(userId, m.bonus_xp);
      }

      awarded.push({ name: m.name, bonus_qlt: m.bonus_qlt, bonus_xp: m.bonus_xp });
    }
  }

  return { awarded };
}

// ── Update trust score ────────────────────────────────────────────────────────
export async function updateTrustScore(userId: number): Promise<{ trustScore: number }> {
  const rows = await sql`SELECT approved_count, rejected_count FROM users WHERE id = ${userId}`;
  const { approved_count, rejected_count } = rows[0];
  const total = (approved_count ?? 0) + (rejected_count ?? 0);

  let trustScore = 100;
  if (total >= 3) {
    const approvalRate = (approved_count ?? 0) / total;
    trustScore = Math.round(approvalRate * 100);
  }

  await sql`UPDATE users SET trust_score = ${trustScore} WHERE id = ${userId}`;
  return { trustScore };
}
