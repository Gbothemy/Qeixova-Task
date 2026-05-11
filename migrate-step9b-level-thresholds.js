/**
 * Update level thresholds to final MVP structure:
 * Starter: 0 – 500,000 QLT (withdrawal unlocks at 500,001)
 * Bronze:  500,001 – 2,000,000 QLT
 * Silver:  2,000,001 – 5,000,000 QLT
 * Gold:    5,000,001 – 10,000,000 QLT
 * VIP:     10,000,001+ QLT
 */
const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

async function migrate() {
  const sql = neon(process.env.DATABASE_URL);
  console.log('Updating level thresholds...\n');

  await sql`UPDATE users SET level_id = NULL`;

  const levels = [
    { level_number: 0, name: 'Starter', min_qlt: 0,        max_qlt: 500000,    daily_cap_qlt: 10000,  badge_color: '#1AEF22', badge_emoji: '🟢', unlock_features: ['open_missions','daily_missions','streak_rewards'] },
    { level_number: 1, name: 'Bronze',  min_qlt: 500001,   max_qlt: 2000000,   daily_cap_qlt: 30000,  badge_color: '#cd7f32', badge_emoji: '🥉', unlock_features: ['open_missions','verified_missions','withdrawals','referral','leaderboard'] },
    { level_number: 2, name: 'Silver',  min_qlt: 2000001,  max_qlt: 5000000,   daily_cap_qlt: 70000,  badge_color: '#aaaaaa', badge_emoji: '🥈', unlock_features: ['open_missions','verified_missions','withdrawals','referral','leaderboard','premium_missions','faster_withdrawals'] },
    { level_number: 3, name: 'Gold',    min_qlt: 5000001,  max_qlt: 10000000,  daily_cap_qlt: 150000, badge_color: '#F5A623', badge_emoji: '🥇', unlock_features: ['open_missions','verified_missions','withdrawals','referral','leaderboard','premium_missions','faster_withdrawals','business_campaigns','priority_withdrawals'] },
    { level_number: 4, name: 'VIP',     min_qlt: 10000001, max_qlt: null,      daily_cap_qlt: 500000, badge_color: '#c084fc', badge_emoji: '👑', unlock_features: ['open_missions','verified_missions','withdrawals','referral','leaderboard','premium_missions','elite_campaigns','instant_withdrawals','highest_payouts'] },
  ];

  await sql`DELETE FROM levels`;

  for (const l of levels) {
    await sql`
      INSERT INTO levels (level_number, name, min_qlt, max_qlt, daily_cap_qlt, badge_color, badge_emoji, unlock_features)
      VALUES (${l.level_number}, ${l.name}, ${l.min_qlt}, ${l.max_qlt}, ${l.daily_cap_qlt}, ${l.badge_color}, ${l.badge_emoji}, ${JSON.stringify(l.unlock_features)})
    `;
    console.log(`✅ ${l.badge_emoji} ${l.name}: ${l.min_qlt.toLocaleString()} – ${l.max_qlt ? l.max_qlt.toLocaleString() : '∞'} QLT | Daily cap: ${l.daily_cap_qlt.toLocaleString()} QLT`);
  }

  // Recalculate all user levels
  const allLevels = await sql`SELECT id, level_number, min_qlt FROM levels ORDER BY min_qlt DESC`;
  const users = await sql`SELECT id, total_earned_qlt, trust_score FROM users`;

  for (const user of users) {
    const earned = Number(user.total_earned_qlt ?? 0);
    const trust = Number(user.trust_score ?? 100);
    let target = allLevels[allLevels.length - 1];
    for (const l of allLevels) {
      if (earned >= Number(l.min_qlt)) {
        if (l.level_number > 0 && trust < 40) continue;
        target = l;
        break;
      }
    }
    await sql`UPDATE users SET level_id = ${target.id} WHERE id = ${user.id}`;
  }
  console.log(`\n✅ Recalculated levels for ${users.length} users`);

  // Update withdrawal config
  await sql`UPDATE system_config SET value = '500001', description = 'Minimum lifetime QLT to unlock withdrawals (Bronze level)' WHERE key = 'min_withdrawal_qlt'`;
  console.log('✅ Withdrawal unlock threshold: 500,001 QLT');

  const dist = await sql`SELECT l.badge_emoji, l.name, COUNT(u.id)::int AS c FROM levels l LEFT JOIN users u ON u.level_id = l.id GROUP BY l.id, l.name, l.badge_emoji ORDER BY l.min_qlt`;
  console.log('\n📊 Level distribution:');
  dist.forEach(r => console.log(`   ${r.badge_emoji} ${r.name}: ${r.c} users`));
  console.log('\n✅ Done.');
  process.exit(0);
}

migrate().catch(e => { console.error('Failed:', e.message); process.exit(1); });
