const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

async function migrate() {
  const sql = neon(process.env.DATABASE_URL);
  console.log('Running business portal migration...');

  // Businesses table
  await sql.unsafe(`
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
  `);

  // Link tasks to businesses
  await sql.unsafe(`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS business_id INT REFERENCES businesses(id)`);
  await sql.unsafe(`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active'`);
  await sql.unsafe(`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS target_completion_count INT NOT NULL DEFAULT 0`);

  console.log('Done!');
  process.exit(0);
}

migrate().catch(e => { console.error(e.message); process.exit(1); });
