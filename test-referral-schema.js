const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

async function checkSchema() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    console.log('🔍 Checking users table schema for referral fields...\n');
    
    // Check if users table has referral fields
    const columns = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'users' 
      AND column_name IN ('referral_code', 'referred_by')
      ORDER BY column_name
    `;
    
    console.log('📋 Referral-related columns in users table:');
    columns.forEach(col => {
      console.log(`   ✓ ${col.column_name} (${col.data_type}) - nullable: ${col.is_nullable}`);
    });
    
    if (columns.length < 2) {
      console.log('\n⚠️  Missing referral columns! Expected: referral_code, referred_by');
    } else {
      console.log('\n✅ All referral columns exist!');
    }
    
    // Check transactions table
    console.log('\n🔍 Checking transactions table...');
    const txColumns = await sql`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'transactions'
      ORDER BY column_name
    `;
    
    console.log('📋 Transactions table columns:');
    txColumns.forEach(col => {
      console.log(`   ✓ ${col.column_name} (${col.data_type})`);
    });
    
    // Test referral query
    console.log('\n🔍 Testing referral query...');
    const testUser = await sql`
      SELECT id, email, referral_code, referred_by, balance
      FROM users
      LIMIT 1
    `;
    
    if (testUser.length > 0) {
      console.log('✅ Sample user data:');
      console.log(`   ID: ${testUser[0].id}`);
      console.log(`   Email: ${testUser[0].email}`);
      console.log(`   Referral Code: ${testUser[0].referral_code || 'NULL'}`);
      console.log(`   Referred By: ${testUser[0].referred_by || 'NULL'}`);
      console.log(`   Balance: ${testUser[0].balance}`);
    }
    
    console.log('\n✅ Database schema check complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkSchema();
