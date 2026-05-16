const { neon } = require("@neondatabase/serverless");
require("dotenv").config();

async function migrate() {
  const sql = neon(process.env.DATABASE_URL);

  await sql`ALTER TABLE businesses ADD COLUMN IF NOT EXISTS balance INTEGER NOT NULL DEFAULT 0`;

  await sql`
    CREATE TABLE IF NOT EXISTS business_transactions (
      id SERIAL PRIMARY KEY,
      business_id INTEGER NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      amount INTEGER NOT NULL,
      label TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'completed',
      provider TEXT,
      reference TEXT UNIQUE,
      metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_business_transactions_business_id ON business_transactions(business_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_business_transactions_reference ON business_transactions(reference)`;

  console.log("Business wallet migration complete");
}

migrate().catch((error) => {
  console.error(error);
  process.exit(1);
});
