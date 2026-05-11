const { neon } = require('@neondatabase/serverless');
require('dotenv').config();
async function run() {
  const sql = neon(process.env.DATABASE_URL);
  const starter = await sql`SELECT id FROM levels WHERE level_number = 0 LIMIT 1`;
  const starterId = starter[0].id;
  await sql.unsafe(`ALTER TABLE users ALTER COLUMN level_id SET DEFAULT ${starterId}`);
  console.log(`✅ level_id default updated to ${starterId} (Starter)`);
  process.exit(0);
}
run().catch(e => { console.error(e.message); process.exit(1); });
