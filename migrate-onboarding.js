const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

async function migrate() {
  const sql = neon(process.env.DATABASE_URL);
  console.log('Running onboarding + trust tier migration...');

  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS trust_level TEXT NOT NULL DEFAULT 'new'`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS approved_count INT NOT NULL DEFAULT 0`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS rejected_count INT NOT NULL DEFAULT 0`;

  // Mark existing users as onboarding complete so they don't see it
  await sql`UPDATE users SET onboarding_completed = TRUE WHERE onboarding_completed = FALSE`;

  console.log('Done!');
}

migrate().catch(e => { console.error(e.message); process.exit(1); });
