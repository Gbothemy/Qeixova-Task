const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

async function migrate() {
  const sql = neon(process.env.DATABASE_URL);
  console.log('Running migration...');

  const cols = [
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS profession TEXT`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS interests TEXT[] NOT NULL DEFAULT '{}'`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS platforms TEXT[] NOT NULL DEFAULT '{}'`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS age_range TEXT`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS gender TEXT`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS state TEXT`,
    `ALTER TABLE tasks ADD COLUMN IF NOT EXISTS target_professions TEXT[] NOT NULL DEFAULT '{}'`,
    `ALTER TABLE tasks ADD COLUMN IF NOT EXISTS target_interests TEXT[] NOT NULL DEFAULT '{}'`,
    `ALTER TABLE tasks ADD COLUMN IF NOT EXISTS target_platforms TEXT[] NOT NULL DEFAULT '{}'`,
    `ALTER TABLE tasks ADD COLUMN IF NOT EXISTS target_age_ranges TEXT[] NOT NULL DEFAULT '{}'`,
    `ALTER TABLE tasks ADD COLUMN IF NOT EXISTS target_genders TEXT[] NOT NULL DEFAULT '{}'`,
    `ALTER TABLE tasks ADD COLUMN IF NOT EXISTS target_states TEXT[] NOT NULL DEFAULT '{}'`,
  ];

  for (const col of cols) {
    await sql.unsafe(col);
    process.stdout.write('.');
  }

  console.log('\nDone!');
  process.exit(0);
}

migrate().catch(e => { console.error(e.message); process.exit(1); });
