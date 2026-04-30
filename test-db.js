const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

async function testConnection() {
  try {
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL is not set');
      process.exit(1);
    }

    console.log('🔄 Testing Neon database connection...');
    const sql = neon(process.env.DATABASE_URL);
    
    // Test query
    const result = await sql`SELECT NOW() as current_time, version() as db_version`;
    
    console.log('✅ Successfully connected to Neon database!');
    console.log('📅 Current time:', result[0].current_time);
    console.log('🗄️  Database version:', result[0].db_version);
    
    // Check if tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    
    console.log('\n📊 Tables in database:');
    if (tables.length === 0) {
      console.log('   No tables found. You may need to run migrations.');
    } else {
      tables.forEach(t => console.log(`   - ${t.table_name}`));
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error.message);
    process.exit(1);
  }
}

testConnection();
