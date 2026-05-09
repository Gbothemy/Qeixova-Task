const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

async function check() {
  const sql = neon(process.env.DATABASE_URL);
  const r = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name='businesses'`;
  console.log('businesses table exists:', r.length > 0);
  
  if (r.length > 0) {
    const cols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name='businesses'`;
    console.log('columns:', cols.map(c => c.column_name).join(', '));
  }
  process.exit(0);
}
check().catch(e => { console.error(e.message); process.exit(1); });
