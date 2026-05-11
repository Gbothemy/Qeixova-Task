const { neon } = require('@neondatabase/serverless');
require('dotenv').config();
async function run() {
  const sql = neon(process.env.DATABASE_URL);

  // Null out level_id to allow deletion
  await sql`UPDATE users SET level_id = NULL`;
  await sql`DELETE FROM levels`;

  // Reset sequence to start from 1
  await sql`ALTER SEQUENCE levels_id_seq RESTART WITH 1`;

  const levels = [
    { level_number: 0, name: 'Starter', min_qlt: 0,        max_qlt: 500000,    daily_cap_qlt: 10000,  badge_color: '#1AEF22', badge_emoji: '🟢', unlock_features: ['open_missions','daily_missions','streak_rewards'] },
    { level_number: 1, name: 'Bronze',  min_qlt: 500001,   max_qlt: 2000000,   daily_cap_qlt: 30000,  badge_color: '#cd7f32', badge_emoji: '🥉', unlock_features: ['open_missions','verified_missions','withdrawals','referral','leaderboard'] },
    { level_number: 2, name: 'Silver',  min_qlt: 2000001,  max_qlt: 5000000,   daily_cap_qlt: 70000,  badge_color: '#aaaaaa', badge_emoji: '🥈', unlock_features: ['open_missions','verified_missions','withdrawals','referral','leaderboard','premium_missions','faster_withdrawals'] },
    { level_number: 3, name: 'Gold',    min_qlt: 5000001,  max_qlt: 10000000,  daily_cap_qlt: 150000, badge_color: '#F5A623', badge_emoji: '🥇', unlock_features: ['open_missions','verified_missions','withdrawals','referral','leaderboard','premium_missions','faster_withdrawals','business_campaigns','priority_withdrawals'] },
    { level_number: 4, name: 'VIP',     min_qlt: 10000001, max_qlt: null,      daily_cap_qlt: 500000, badge_color: '#c084fc', badge_emoji: '👑', unlock_features: ['open_missions','verified_missions','withdrawals','referral','leaderboard','premium_missions','elite_campaigns','instant_withdrawals','highest_payouts'] },
  ];

  for (const l of levels) {
    const result = await sql`
      INSERT INTO levels (level_number, name, min_qlt, max_qlt, daily_cap_qlt, badge_color, badge_emoji, unlock_features)
      VALUES (${l.level_number}, ${l.name}, ${l.min_qlt}, ${l.max_qlt}, ${l.daily_cap_qlt}, ${l.badge_color}, ${l.badge_emoji}, ${JSON.stringify(l.unlock_features)})
      RETURNING id
    `;
    console.log(`✅ ${l.badge_emoji} ${l.name} → id: ${result[0].id}`);
  }

  // Set default to 1 (Starter)
  await sql.unsafe(`ALTER TABLE users ALTER COLUMN level_id SET DEFAULT 1`);
  console.log('✅ level_id default = 1 (Starter)');

  // Restore all users to Starter (id=1)
  await sql`UPDATE users SET level_id = 1`;
  console.log('✅ All users set to Starter');

  const check = await sql`SELECT id, level_number, name FROM levels ORDER BY id`;
  console.log('\nFinal levels:', check);
  process.exit(0);
}
run().catch(e => { console.error(e.message); process.exit(1); });
