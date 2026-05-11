const { neon } = require('@neondatabase/serverless');
require('dotenv').config();
async function run() {
  const sql = neon(process.env.DATABASE_URL);
  const levels = await sql`SELECT id, level_number, name FROM levels ORDER BY level_number`;
  console.log('Levels:', levels);
  // Check default value on level_id column
  const col = await sql`SELECT column_default FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'level_id'`;
  console.log('level_id default:', col[0]?.column_default);
  process.exit(0);
}
run().catch(e => { console.error(e.message); process.exit(1); });
