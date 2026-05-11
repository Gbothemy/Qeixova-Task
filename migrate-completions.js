const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

async function migrate() {
  const sql = neon(process.env.DATABASE_URL);
  console.log('🔄 Running migration: adding status and rejection_reason to completions...');

  try {
    // Add status column with default 'approved' for existing rows (they were already credited)
    await sql`
      ALTER TABLE completions 
      ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'approved'
    `;
    console.log('✅ Added status column');

    // Add rejection_reason column
    await sql`
      ALTER TABLE completions 
      ADD COLUMN IF NOT EXISTS rejection_reason TEXT
    `;
    console.log('✅ Added rejection_reason column');

    // Verify
    const cols = await sql`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns
      WHERE table_name = 'completions'
      ORDER BY ordinal_position
    `;
    console.log('\n📋 Completions table columns:');
    cols.forEach(c => console.log(`   - ${c.column_name} (${c.data_type}) default: ${c.column_default ?? 'none'}`));

    console.log('\n✅ Migration complete!');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
}

migrate();
