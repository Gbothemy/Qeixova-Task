/**
 * STEP 9 — Replace XP with QLT-based level system
 * - New levels table (Starter → VIP) based on total_earned_qlt
 * - Add total_earned_qlt to users (already exists as total_xp_earned alias)
 * - Withdrawal gated at Bronze (100,001 QLT lifetime)
 * - Daily caps per level in QLT
 */
const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

async function migrate() {
  const sql = neon(process.env.DATABASE_URL);
  console.log('Running Step 9 — QLT-based level system...\n');

  // ── 1. Wipe old XP-based levels and replace ──────────────────────────────
  // Temporarily set all users to NULL level_id to allow level deletion
  await sql`UPDATE users SET level_id = NULL`;
  await sql`DELETE FROM levels`;
  console.log('✅ Cleared old XP levels');

  const newLevels = [
    { level_number: 0, name: 'Starter', min_qlt: 0,       max_qlt: 100000,   daily_cap_qlt: 10000,  badge_color: '#1AEF22', badge_emoji: '🟢', unlock_features: ['open_missions'] },
    { level_number: 1, name: 'Bronze',  min_qlt: 100001,   max_qlt: 500000,   daily_cap_qlt: 30000,  badge_color: '#cd7f32', badge_emoji: '🥉', unlock_features: ['open_missions','verified_missions','referral','withdrawals'] },
    { level_number: 2, name: 'Silver',  min_qlt: 500001,   max_qlt: 1500000,  daily_cap_qlt: 70000,  badge_color: '#aaaaaa', badge_emoji: '🥈', unlock_features: ['open_missions','verified_missions','referral','withdrawals','surveys','faster_withdrawals'] },
    { level_number: 3, name: 'Gold',    min_qlt: 1500001,  max_qlt: 5000000,  daily_cap_qlt: 150000, badge_color: '#F5A623', badge_emoji: '🥇', unlock_features: ['open_missions','verified_missions','referral','withdrawals','surveys','faster_withdrawals','premium_missions','app_testing','ai_tasks'] },
    { level_number: 4, name: 'VIP',     min_qlt: 5000001,  max_qlt: null,     daily_cap_qlt: 500000, badge_color: '#c084fc', badge_emoji: '👑', unlock_features: ['open_missions','verified_missions','referral','withdrawals','surveys','faster_withdrawals','premium_missions','app_testing','ai_tasks','elite_campaigns','priority_approval','instant_withdrawals'] },
  ];

  // Add min_qlt and max_qlt columns if not exist
  await sql`ALTER TABLE levels ADD COLUMN IF NOT EXISTS min_qlt BIGINT NOT NULL DEFAULT 0`;
  await sql`ALTER TABLE levels ADD COLUMN IF NOT EXISTS max_qlt BIGINT`;
  await sql`ALTER TABLE levels ADD COLUMN IF NOT EXISTS badge_emoji TEXT DEFAULT '🟢'`;
  console.log('✅ levels table columns updated');

  for (const l of newLevels) {
    await sql`
      INSERT INTO levels (level_number, name, min_qlt, max_qlt, daily_cap_qlt, badge_color, badge_emoji, unlock_features)
      VALUES (${l.level_number}, ${l.name}, ${l.min_qlt}, ${l.max_qlt}, ${l.daily_cap_qlt}, ${l.badge_color}, ${l.badge_emoji}, ${JSON.stringify(l.unlock_features)})
      ON CONFLICT (level_number) DO UPDATE SET
        name = EXCLUDED.name, min_qlt = EXCLUDED.min_qlt, max_qlt = EXCLUDED.max_qlt,
        daily_cap_qlt = EXCLUDED.daily_cap_qlt, badge_color = EXCLUDED.badge_color,
        badge_emoji = EXCLUDED.badge_emoji, unlock_features = EXCLUDED.unlock_features
    `;
  }
  console.log('✅ 5 new QLT-based levels seeded (Starter → VIP)');

  // ── 2. Ensure total_earned_qlt column exists on users ────────────────────
  // (total_xp_earned was the old name — add total_earned_qlt as the canonical one)
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS total_earned_qlt BIGINT NOT NULL DEFAULT 0`;
  console.log('✅ users.total_earned_qlt');

  // ── 3. Backfill total_earned_qlt from transactions ────────────────────────
  await sql`
    UPDATE users u
    SET total_earned_qlt = COALESCE((
      SELECT SUM(t.amount) FROM transactions t
      WHERE t.user_id = u.id AND t.type = 'credit'
    ), 0)
    WHERE total_earned_qlt = 0
  `;
  console.log('✅ Backfilled total_earned_qlt from transactions');

  // ── 4. Recalculate level_id for all users based on total_earned_qlt ───────
  const levels = await sql`SELECT id, level_number, min_qlt, max_qlt FROM levels ORDER BY min_qlt DESC`;
  const users = await sql`SELECT id, total_earned_qlt, trust_score FROM users`;

  let updated = 0;
  for (const user of users) {
    const earned = Number(user.total_earned_qlt ?? 0);
    const trust = Number(user.trust_score ?? 100);

    // Find correct level — trust score must be >= 40 to level up past Starter
    let targetLevel = levels[levels.length - 1]; // default Starter
    for (const l of levels) {
      if (earned >= Number(l.min_qlt)) {
        // Trust gate: need trust >= 40 to go above Starter
        if (l.level_number > 0 && trust < 40) continue;
        targetLevel = l;
        break;
      }
    }

    await sql`UPDATE users SET level_id = ${targetLevel.id} WHERE id = ${user.id}`;
    updated++;
  }
  console.log(`✅ Recalculated levels for ${updated} users`);

  // ── 5. Update system_config for new withdrawal minimum ───────────────────
  await sql`
    INSERT INTO system_config (key, value, description)
    VALUES ('min_withdrawal_qlt', '100000', 'Minimum lifetime QLT earned to unlock withdrawals (Bronze level)')
    ON CONFLICT (key) DO UPDATE SET value = '100000', description = EXCLUDED.description
  `;
  await sql`
    INSERT INTO system_config (key, value, description)
    VALUES ('withdrawal_unlock_level', '1', 'Level number required to withdraw (1 = Bronze)')
    ON CONFLICT (key) DO UPDATE SET value = '1'
  `;
  console.log('✅ system_config updated');

  // ── Verify ────────────────────────────────────────────────────────────────
  const levelDist = await sql`
    SELECT l.name, l.badge_emoji, COUNT(u.id)::int AS users
    FROM levels l
    LEFT JOIN users u ON u.level_id = l.id
    GROUP BY l.id, l.name, l.badge_emoji
    ORDER BY l.min_qlt
  `;
  console.log('\n📊 Level distribution:');
  levelDist.forEach(r => console.log(`   ${r.badge_emoji} ${r.name}: ${r.users} users`));
  console.log('\n✅ Step 9 complete — QLT-based levels active.');
  process.exit(0);
}

migrate().catch(e => { console.error('Migration failed:', e.message); process.exit(1); });
