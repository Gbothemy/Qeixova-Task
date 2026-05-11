/**
 * STEP 8 — Password resets table + seed starter missions
 */
const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

async function migrate() {
  const sql = neon(process.env.DATABASE_URL);
  console.log('Running Step 8 — Password resets + seed missions...\n');

  // ── 1. Password resets table ─────────────────────────────────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS password_resets (
      id         SERIAL PRIMARY KEY,
      user_id    INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token      TEXT NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  console.log('✅ password_resets table');

  // ── 2. Seed starter missions ─────────────────────────────────────────────
  const existing = await sql`SELECT COUNT(*)::int AS c FROM tasks`;
  if (existing[0].c > 0) {
    console.log(`✅ Tasks already exist (${existing[0].c}), skipping seed`);
  } else {
    const missions = [
      {
        title: "Follow Qeixova on X (Twitter)",
        category: "Social Media", mission_type: "engagement",
        reward: 12000, xp_reward: 10, duration: "2 min",
        instructions: "Follow the official Qeixova account on X (Twitter) and take a screenshot showing you followed.",
        proof_type: "screenshot", proof_label: "Screenshot showing you followed @QeixovaTech",
        task_link: "https://x.com/QeixovaTech",
        total_budget: 500000, target_completion_count: 50,
        min_level: 1, difficulty: "easy", is_active: true,
      },
      {
        title: "Like & Share Qeixova Facebook Page",
        category: "Social Media", mission_type: "engagement",
        reward: 10000, xp_reward: 10, duration: "2 min",
        instructions: "Like the Qeixova Facebook page and share it to your timeline. Screenshot both actions.",
        proof_type: "screenshot", proof_label: "Screenshot showing page liked and shared",
        task_link: "https://www.facebook.com/profile.php?id=61568026449468",
        total_budget: 400000, target_completion_count: 40,
        min_level: 1, difficulty: "easy", is_active: true,
      },
      {
        title: "Complete a 5-Question Product Survey",
        category: "Survey", mission_type: "participation",
        reward: 35000, xp_reward: 25, duration: "5 min",
        instructions: "Answer 5 questions about your online shopping habits. Be honest — your feedback shapes real products.",
        proof_type: "text", proof_label: "Paste your survey completion code here",
        task_link: "",
        total_budget: 1000000, target_completion_count: 30,
        min_level: 1, difficulty: "medium", is_active: true,
      },
      {
        title: "Test the Qeixova Mobile App & Report 3 Issues",
        category: "App Testing", mission_type: "premium",
        reward: 85000, xp_reward: 50, duration: "15 min",
        instructions: "Use the Qeixova app for 10 minutes. Find and report at least 3 bugs, UX issues, or improvement suggestions.",
        proof_type: "screenshot", proof_label: "Screenshot of 3 issues you found with descriptions",
        task_link: "https://qeixov.vercel.app",
        total_budget: 2000000, target_completion_count: 25,
        min_level: 2, difficulty: "hard", is_active: true,
      },
      {
        title: "Rate AI Response Quality",
        category: "AI Testing", mission_type: "participation",
        reward: 20000, xp_reward: 25, duration: "5 min",
        instructions: "Read 3 AI-generated responses and rate each one on accuracy, helpfulness, and clarity. Submit your ratings as text.",
        proof_type: "text", proof_label: "Your ratings: Response 1: X/5, Response 2: X/5, Response 3: X/5 + brief reason",
        task_link: "",
        total_budget: 800000, target_completion_count: 40,
        min_level: 1, difficulty: "medium", is_active: true,
      },
    ];

    for (const m of missions) {
      await sql`
        INSERT INTO tasks (
          title, category, mission_type, reward, xp_reward, duration,
          instructions, proof_type, proof_label, task_link,
          total_budget, target_completion_count, min_level, difficulty,
          is_active, task_status, icon, color,
          verification_type, steps
        ) VALUES (
          ${m.title}, ${m.category}, ${m.mission_type}, ${m.reward}, ${m.xp_reward},
          ${m.duration}, ${m.instructions}, ${m.proof_type}, ${m.proof_label},
          ${m.task_link}, ${m.total_budget}, ${m.target_completion_count},
          ${m.min_level}, ${m.difficulty}, ${m.is_active}, 'active',
          ${'📋'}, ${'#111111'}, ${m.proof_type}, ${'{}'}
        )
      `;
    }
    console.log(`✅ Seeded ${missions.length} starter missions`);
  }

  // ── 3. Add forgot_password link to login page (just verify table) ─────────
  const resetCount = await sql`SELECT COUNT(*)::int AS c FROM password_resets`;
  console.log(`✅ password_resets table ready (${resetCount[0].c} rows)`);

  const taskCount = await sql`SELECT COUNT(*)::int AS c FROM tasks WHERE is_active = true`;
  console.log(`\n📊 Active missions: ${taskCount[0].c}`);
  console.log('✅ Step 8 complete.');
  process.exit(0);
}

migrate().catch(e => { console.error('Migration failed:', e.message); process.exit(1); });
