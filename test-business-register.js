const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

async function test() {
  const sql = neon(process.env.DATABASE_URL);
  
  // Check if businesses table exists and has correct schema
  console.log('Checking businesses table...');
  const cols = await sql`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'businesses'
    ORDER BY ordinal_position
  `;
  
  if (cols.length === 0) {
    console.log('❌ businesses table does not exist!');
  } else {
    console.log('✅ businesses table columns:');
    cols.forEach(c => console.log(`   - ${c.column_name} (${c.data_type})`));
  }

  // Check tasks table for business_id column
  const taskCols = await sql`
    SELECT column_name FROM information_schema.columns 
    WHERE table_name = 'tasks' AND column_name IN ('business_id', 'status', 'target_completion_count')
  `;
  console.log('\nTasks table business columns:', taskCols.map(c => c.column_name));

  process.exit(0);
}

test().catch(e => { console.error(e.message); process.exit(1); });
