import { sql } from "@/lib/db";

export async function ensureBusinessWalletTables() {
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
}

export function makeFundingReference(businessId: number) {
  return `QXB-${businessId}-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}
