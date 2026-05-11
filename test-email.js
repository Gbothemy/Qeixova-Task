const nodemailer = require('nodemailer');
require('dotenv').config();

async function test() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  console.log(`Sending test email from ${process.env.GMAIL_USER}...`);

  await transporter.sendMail({
    from: `"Qeixova" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER, // send to self as test
    subject: '✅ Qeixova Email Test',
    html: '<h2>Email is working!</h2><p>Your Qeixova email system is configured correctly.</p>',
  });

  console.log('✅ Email sent successfully!');
  process.exit(0);
}

test().catch(e => { console.error('❌ Failed:', e.message); process.exit(1); });
