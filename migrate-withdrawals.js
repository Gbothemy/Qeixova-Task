const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

async function migrate() {
  const sql = neon(process.env.DATABASE_URL);
  console.log('Updating transactions status constraint...');
  await sql`ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_status_check`;
  await sql`ALTER TABLE transactions ADD CONSTRAINT transactions_status_check CHECK (status IN ('completed','pending','failed','processing'))`;
  console.log('Done!');
}

migrate().catch(e => { console.error(e.message); process.exit(1); });
