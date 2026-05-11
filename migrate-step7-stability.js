/**
 * STEP 7 — System Integration + Stability Layer
 * - UNIQUE constraint on completions(user_id, task_id)
 * - audit_logs table for all earning events
 * - rate_limits table for anti-fraud
 * - system_config table for economy tuning (Step 9)
 * - invite_codes table for beta access (Step 8)
 */
const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

async function migrate() {
  const sql = neon(process.env.DATABASE_URL);
  console.log('Running Step 7 — Stability Layer...\n');

  // ── 1. UNIQUE constraint on completions ──────────────────────────────────
  // Prevents double submissions at DB level
  const constraintExists = await sql`
    SELECT 1 FROM pg_constraint
    WHERE conname = 'completions_user_task_unique'
  `;
  if (constraintExists.length === 0) {
    // First remove any existing duplicates (keep earliest)
    await sql`
      DELETE FROM completions a USING completions b
      WHERE a.id > b.id
        AND a.user_id = b.user_id
        AND a.task_id = b.task_id
    `;
    await sql`
      ALTER TABLE completions
      ADD CONSTRAINT completions_user_task_unique UNIQUE (user_id, task_id)
    `;
    console.log('✅ UNIQUE(user_id, task_id) constraint on completions');
  } else {
    console.log('✅ UNIQUE constraint already exists');
  }

  // ── 2. AUDIT LOGS TABLE ───────────────────────────────────────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id          SERIAL PRIMARY KEY,
      user_id     INT REFERENCES users(id),
      event_type  TEXT NOT NULL,
      entity_type TEXT,
      entity_id   INT,
      data        JSONB DEFAULT '{}',
      ip_address  TEXT,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS audit_logs_user_idx ON audit_logs(user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS audit_logs_event_idx ON audit_logs(event_type)`;
  await sql`CREATE INDEX IF NOT EXISTS audit_logs_created_idx ON audit_logs(created_at DESC)`;
  console.log('✅ audit_logs table + indexes');

  // ── 3. RATE LIMITS TABLE ──────────────────────────────────────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS rate_limits (
      id           SERIAL PRIMARY KEY,
      user_id      INT REFERENCES users(id),
      action       TEXT NOT NULL,
      window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      count        INT NOT NULL DEFAULT 1,
      UNIQUE(user_id, action, window_start)
    )
  `;
  console.log('✅ rate_limits table');

  // ── 4. SYSTEM CONFIG TABLE (Step 9 — economy tuning) ─────────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS system_config (
      key         TEXT PRIMARY KEY,
      value       TEXT NOT NULL,
      description TEXT,
      updated_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  const configs = [
    { key: 'max_submissions_per_hour',  value: '10',    description: 'Max mission submissions per user per hour' },
    { key: 'referral_bonus_qlt',        value: '2500',  description: 'QLT bonus for referrer on new signup' },
    { key: 'referral_welcome_qlt',      value: '1000',  description: 'QLT welcome bonus for referred user' },
    { key: 'referral_earnings_pct',     value: '10',    description: 'Percentage of approved earnings credited to referrer' },
    { key: 'min_withdrawal_qlt',        value: '100000',description: 'Minimum QLT required to withdraw' },
    { key: 'platform_fee_pct',          value: '40',    description: 'Platform cut percentage from business payments' },
    { key: 'trust_score_flag_threshold',value: '50',    description: 'Trust score below this flags the account' },
    { key: 'trust_score_min_missions',  value: '3',     description: 'Minimum missions before trust score is enforced' },
  ];

  for (const c of configs) {
    await sql`
      INSERT INTO system_config (key, value, description)
      VALUES (${c.key}, ${c.value}, ${c.description})
      ON CONFLICT (key) DO NOTHING
    `;
  }
  console.log('✅ system_config table + defaults');

  // ── 6. Add submission_count column to users for rate limiting ─────────────
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS hourly_submissions INT NOT NULL DEFAULT 0`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS hourly_reset_at TIMESTAMPTZ DEFAULT NOW()`;
  console.log('✅ users.hourly_submissions + hourly_reset_at');

  // ── 7. Add indexes for performance ───────────────────────────────────────
  await sql`CREATE INDEX IF NOT EXISTS completions_user_idx ON completions(user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS completions_task_idx ON completions(task_id)`;
  await sql`CREATE INDEX IF NOT EXISTS completions_status_idx ON completions(status)`;
  await sql`CREATE INDEX IF NOT EXISTS transactions_user_idx ON transactions(user_id)`;
  console.log('✅ performance indexes');

  // ── Verify ────────────────────────────────────────────────────────────────
  const configCount = await sql`SELECT COUNT(*)::int AS c FROM system_config`;
  const logCount    = await sql`SELECT COUNT(*)::int AS c FROM audit_logs`;
  console.log(`\n📊 Summary:`);
  console.log(`   system_config entries: ${configCount[0].c}`);
  console.log(`   audit_logs rows: ${logCount[0].c}`);
  console.log('\n✅ Step 7 migration complete.');
  process.exit(0);
}

migrate().catch(e => { console.error('Migration failed:', e.message); process.exit(1); });
