/**
 * STEP 1 — Data Foundation Migration
 * Adds mission system tables and columns without breaking existing frontend.
 * Safe to run multiple times (uses IF NOT EXISTS / ADD COLUMN IF NOT EXISTS).
 */
const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

async function migrate() {
  const sql = neon(process.env.DATABASE_URL);
  console.log('Running Step 1 — Mission System Data Foundation...\n');

  // ── 1. LEVELS TABLE ──────────────────────────────────────────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS levels (
      id              SERIAL PRIMARY KEY,
      level_number    INT UNIQUE NOT NULL,
      name            TEXT NOT NULL,
      xp_required     INT NOT NULL DEFAULT 0,
      daily_cap_qlt   INT NOT NULL DEFAULT 0,
      unlock_features JSONB DEFAULT '[]',
      badge_color     TEXT DEFAULT '#888888',
      created_at      TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  console.log('✅ levels table');

  // Seed level data
  const levelData = [
    { level_number: 1, name: 'Starter',   xp_required: 0,    daily_cap_qlt: 5000,   badge_color: '#888888', unlock_features: ['engagement_missions'] },
    { level_number: 2, name: 'Explorer',  xp_required: 500,  daily_cap_qlt: 15000,  badge_color: '#4a9eff', unlock_features: ['engagement_missions','participation_missions'] },
    { level_number: 3, name: 'Achiever',  xp_required: 1500, daily_cap_qlt: 35000,  badge_color: '#1AEF22', unlock_features: ['engagement_missions','participation_missions','premium_missions'] },
    { level_number: 4, name: 'Expert',    xp_required: 4000, daily_cap_qlt: 75000,  badge_color: '#F5A623', unlock_features: ['engagement_missions','participation_missions','premium_missions','leaderboard_bonus'] },
    { level_number: 5, name: 'Elite',     xp_required: 10000,daily_cap_qlt: 150000, badge_color: '#e53e3e', unlock_features: ['engagement_missions','participation_missions','premium_missions','leaderboard_bonus','ugc_missions'] },
  ];

  for (const l of levelData) {
    await sql`
      INSERT INTO levels (level_number, name, xp_required, daily_cap_qlt, badge_color, unlock_features)
      VALUES (${l.level_number}, ${l.name}, ${l.xp_required}, ${l.daily_cap_qlt}, ${l.badge_color}, ${JSON.stringify(l.unlock_features)})
      ON CONFLICT (level_number) DO UPDATE SET
        name = EXCLUDED.name,
        xp_required = EXCLUDED.xp_required,
        daily_cap_qlt = EXCLUDED.daily_cap_qlt,
        badge_color = EXCLUDED.badge_color,
        unlock_features = EXCLUDED.unlock_features
    `;
  }
  console.log('✅ levels seeded (5 levels)');

  // ── 2. UPDATE USERS TABLE ────────────────────────────────────────────────
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS xp INT NOT NULL DEFAULT 0`;
  console.log('✅ users.xp');
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS trust_score INT NOT NULL DEFAULT 100`;
  console.log('✅ users.trust_score');
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS level_id INT REFERENCES levels(id) DEFAULT 1`;
  console.log('✅ users.level_id');
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS daily_earned INT NOT NULL DEFAULT 0`;
  console.log('✅ users.daily_earned');
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS daily_reset_at DATE DEFAULT CURRENT_DATE`;
  console.log('✅ users.daily_reset_at');
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS total_xp_earned INT NOT NULL DEFAULT 0`;
  console.log('✅ users.total_xp_earned');
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS milestone_bonus_claimed INT NOT NULL DEFAULT 0`;
  console.log('✅ users.milestone_bonus_claimed');

  // ── 3. UPDATE TASKS TABLE (mission fields) ───────────────────────────────
  await sql`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS mission_type TEXT NOT NULL DEFAULT 'engagement'`;
  console.log('✅ tasks.mission_type');
  await sql`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS xp_reward INT NOT NULL DEFAULT 10`;
  console.log('✅ tasks.xp_reward');
  await sql`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS verification_type TEXT NOT NULL DEFAULT 'screenshot'`;
  console.log('✅ tasks.verification_type');
  await sql`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS difficulty TEXT NOT NULL DEFAULT 'easy'`;
  console.log('✅ tasks.difficulty');
  await sql`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS min_level INT NOT NULL DEFAULT 1`;
  console.log('✅ tasks.min_level');
  await sql`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS estimated_time TEXT DEFAULT '5 min'`;
  console.log('✅ tasks.estimated_time');

  // ── 4. UPDATE COMPLETIONS TABLE ──────────────────────────────────────────
  await sql`ALTER TABLE completions ADD COLUMN IF NOT EXISTS xp_awarded INT DEFAULT 0`;
  console.log('✅ completions.xp_awarded');
  await sql`ALTER TABLE completions ADD COLUMN IF NOT EXISTS qlt_awarded INT DEFAULT 0`;
  console.log('✅ completions.qlt_awarded');

  // ── 5. MILESTONES TABLE ──────────────────────────────────────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS milestones (
      id              SERIAL PRIMARY KEY,
      name            TEXT NOT NULL,
      description     TEXT,
      trigger_type    TEXT NOT NULL,  -- 'total_completions' | 'total_xp' | 'streak'
      trigger_value   INT NOT NULL,
      bonus_qlt       INT NOT NULL DEFAULT 0,
      bonus_xp        INT NOT NULL DEFAULT 0,
      created_at      TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  console.log('✅ milestones table');

  // Seed milestones
  const milestones = [
    { name: 'First Mission',    description: 'Complete your first mission',      trigger_type: 'total_completions', trigger_value: 1,   bonus_qlt: 500,   bonus_xp: 50  },
    { name: 'Getting Started',  description: 'Complete 5 missions',              trigger_type: 'total_completions', trigger_value: 5,   bonus_qlt: 2000,  bonus_xp: 100 },
    { name: 'On a Roll',        description: 'Complete 15 missions',             trigger_type: 'total_completions', trigger_value: 15,  bonus_qlt: 5000,  bonus_xp: 250 },
    { name: 'Mission Master',   description: 'Complete 50 missions',             trigger_type: 'total_completions', trigger_value: 50,  bonus_qlt: 15000, bonus_xp: 500 },
    { name: 'Century Club',     description: 'Complete 100 missions',            trigger_type: 'total_completions', trigger_value: 100, bonus_qlt: 50000, bonus_xp: 1000},
    { name: 'Week Warrior',     description: '7-day streak',                     trigger_type: 'streak',            trigger_value: 7,   bonus_qlt: 3000,  bonus_xp: 150 },
    { name: 'Month Strong',     description: '30-day streak',                    trigger_type: 'streak',            trigger_value: 30,  bonus_qlt: 20000, bonus_xp: 500 },
    { name: 'XP Grinder',       description: 'Earn 1000 XP total',              trigger_type: 'total_xp',          trigger_value: 1000,bonus_qlt: 5000,  bonus_xp: 0   },
  ];

  for (const m of milestones) {
    await sql`
      INSERT INTO milestones (name, description, trigger_type, trigger_value, bonus_qlt, bonus_xp)
      VALUES (${m.name}, ${m.description}, ${m.trigger_type}, ${m.trigger_value}, ${m.bonus_qlt}, ${m.bonus_xp})
      ON CONFLICT DO NOTHING
    `;
  }
  console.log('✅ milestones seeded (8 milestones)');

  // ── 6. USER MILESTONES (claimed tracking) ────────────────────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS user_milestones (
      id           SERIAL PRIMARY KEY,
      user_id      INT NOT NULL REFERENCES users(id),
      milestone_id INT NOT NULL REFERENCES milestones(id),
      claimed_at   TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, milestone_id)
    )
  `;
  console.log('✅ user_milestones table');

  // ── 7. BACKFILL existing users with level_id = 1 ─────────────────────────
  await sql`UPDATE users SET level_id = 1 WHERE level_id IS NULL`;
  console.log('✅ backfilled existing users → level 1');

  // ── 8. BACKFILL existing tasks with mission_type based on category ────────
  await sql`
    UPDATE tasks SET mission_type = CASE
      WHEN category IN ('Social Media') THEN 'engagement'
      WHEN category IN ('Survey', 'AI Testing') THEN 'participation'
      WHEN category IN ('App Testing', 'Content') THEN 'premium'
      ELSE 'engagement'
    END
    WHERE mission_type = 'engagement' OR mission_type IS NULL
  `;
  console.log('✅ backfilled existing tasks with mission_type');

  // ── 9. BACKFILL xp_reward based on mission_type ──────────────────────────
  await sql`
    UPDATE tasks SET xp_reward = CASE
      WHEN mission_type = 'engagement'    THEN 10
      WHEN mission_type = 'participation' THEN 25
      WHEN mission_type = 'premium'       THEN 50
      ELSE 10
    END
    WHERE xp_reward = 0 OR xp_reward IS NULL
  `;
  console.log('✅ backfilled xp_reward values');

  // ── Verify ────────────────────────────────────────────────────────────────
  const levelCount  = await sql`SELECT COUNT(*)::int AS c FROM levels`;
  const userCount   = await sql`SELECT COUNT(*)::int AS c FROM users`;
  const taskCount   = await sql`SELECT COUNT(*)::int AS c FROM tasks`;
  const missionDist = await sql`SELECT mission_type, COUNT(*)::int AS c FROM tasks GROUP BY mission_type`;

  console.log(`\n📊 Summary:`);
  console.log(`   Levels: ${levelCount[0].c}`);
  console.log(`   Users:  ${userCount[0].c}`);
  console.log(`   Tasks:  ${taskCount[0].c}`);
  console.log(`   Mission distribution:`, missionDist);
  console.log('\n✅ Step 1 complete. DB foundation ready.');
  process.exit(0);
}

migrate().catch(e => { console.error('Migration failed:', e.message); process.exit(1); });
