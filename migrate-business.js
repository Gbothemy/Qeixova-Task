const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

async function migrate() {
  const sql = neon(process.env.DATABASE_URL);
  console.log('Running business portal migration...');

  await sql`
    CREATE TABLE IF NOT EXISTS businesses (
      id            SERIAL PRIMARY KEY,
      name          TEXT NOT NULL,
      email         TEXT UNIQUE NOT NULL,
      password      TEXT NOT NULL,
      industry      TEXT,
      website       TEXT,
      logo_url      TEXT,
      balance       INTEGER NOT NULL DEFAULT 0,
      status        TEXT NOT NULL DEFAULT 'active',
      created_at    TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  console.log('✅ businesses table');

  await sql`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS task_status TEXT NOT NULL DEFAULT 'active'`;
  console.log('✅ tasks.task_status');

  await sql`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS target_completion_count INT NOT NULL DEFAULT 0`;
  console.log('✅ tasks.target_completion_count');

  await sql`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS business_id INT`;
  console.log('✅ tasks.business_id');

  // Add FK only if it doesn't exist
  const fkExists = await sql`
    SELECT 1 FROM pg_constraint WHERE conname = 'tasks_business_id_fkey'
  `;
  if (fkExists.length === 0) {
    await sql`
      ALTER TABLE tasks ADD CONSTRAINT tasks_business_id_fkey
      FOREIGN KEY (business_id) REFERENCES businesses(id)
    `;
  }
  console.log('✅ FK constraint');

  const check = await sql`SELECT COUNT(*)::int AS count FROM businesses`;
  console.log(`✅ businesses table ready (${check[0].count} rows)`);
  console.log('\nDone!');
  process.exit(0);
}

migrate().catch(e => { console.error('Failed:', e.message); process.exit(1); });
