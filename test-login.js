const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function testLogin() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const email = 'flinttech.22@gmail.com';
    const password = '12345678';
    
    console.log('🔍 Checking user:', email);
    
    // Check if user exists
    const users = await sql`SELECT * FROM users WHERE email = ${email}`;
    
    if (users.length === 0) {
      console.log('❌ User not found in database');
      console.log('\n📝 Creating user...');
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user
      const newUser = await sql`
        INSERT INTO users (email, password, full_name, balance, streak, last_active, created_at)
        VALUES (${email}, ${hashedPassword}, 'Flint Tech', 0, 0, NOW(), NOW())
        RETURNING id, email, full_name, balance, streak
      `;
      
      console.log('✅ User created successfully!');
      console.log('User details:', newUser[0]);
      return;
    }
    
    const user = users[0];
    console.log('✅ User found!');
    console.log('User ID:', user.id);
    console.log('Email:', user.email);
    console.log('Full Name:', user.full_name);
    console.log('Balance:', user.balance);
    console.log('Streak:', user.streak);
    
    // Verify password
    console.log('\n🔐 Verifying password...');
    const isValid = await bcrypt.compare(password, user.password);
    
    if (isValid) {
      console.log('✅ Password is correct! Login would succeed.');
    } else {
      console.log('❌ Password is incorrect!');
      console.log('\n🔄 Updating password to "12345678"...');
      
      const hashedPassword = await bcrypt.hash(password, 10);
      await sql`UPDATE users SET password = ${hashedPassword} WHERE id = ${user.id}`;
      
      console.log('✅ Password updated successfully!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testLogin();
