const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

// Use direct connection string without pooler
const DB_URL = process.env.DATABASE_URL;

async function migrate() {
  const sql = neon(DB_URL);
  
  console.log('Step 1: Creating businesses table...');
  const result = await sql`
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
  console.log('Created:', result);

  console.log('Step 2: Verifying...');
  const check = await sql`
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'businesses'
  `;
  console.log('Table exists:', check.length > 0, check);
  
  process.exit(0);
}

migrate().catch(e => { console.error('Error:', e); process.exit(1); });
