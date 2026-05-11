/**
 * Email service — uses Resend when RESEND_API_KEY is set,
 * falls back to console logging in development.
 * To enable: add RESEND_API_KEY to your .env
 */

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://qeixov.vercel.app";
const FROM_EMAIL = process.env.EMAIL_FROM ?? "noreply@qeixova.com";
const RESEND_KEY = process.env.RESEND_API_KEY;

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  if (!RESEND_KEY) {
    // Dev fallback — log to console
    console.log(`\n📧 [EMAIL] To: ${to}\nSubject: ${subject}\n${html.replace(/<[^>]+>/g, "").trim().slice(0, 300)}\n`);
    return;
  }

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: `Qeixova <${FROM_EMAIL}>`, to, subject, html }),
  });
}

// ── Templates ────────────────────────────────────────────────────────────────

export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  await sendEmail(to, "Welcome to Qeixova — Start Earning!", `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#000;color:#F5F5F5;padding:32px;border-radius:16px">
      <img src="${APP_URL}/qeixova-icon.png" width="48" style="border-radius:12px;margin-bottom:20px" />
      <h1 style="font-size:22px;font-weight:900;color:#F5F5F5;margin:0 0 8px">Welcome, ${name}! 🎉</h1>
      <p style="color:#888;font-size:14px;line-height:1.7">Your Qeixova account is ready. Complete missions, earn QLT, and convert to real Naira.</p>
      <a href="${APP_URL}/tasks" style="display:inline-block;margin-top:24px;background:linear-gradient(135deg,#F5A623,#d89420);color:#000;text-decoration:none;padding:13px 28px;border-radius:11px;font-weight:800;font-size:14px">Browse Missions →</a>
      <p style="color:#333;font-size:12px;margin-top:28px">100 QLT = ₦1 · Transparent · No hidden fees</p>
    </div>
  `);
}

export async function sendPasswordResetEmail(to: string, name: string, token: string): Promise<void> {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;
  await sendEmail(to, "Reset your Qeixova password", `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#000;color:#F5F5F5;padding:32px;border-radius:16px">
      <img src="${APP_URL}/qeixova-icon.png" width="48" style="border-radius:12px;margin-bottom:20px" />
      <h1 style="font-size:20px;font-weight:900;color:#F5F5F5;margin:0 0 8px">Password Reset</h1>
      <p style="color:#888;font-size:14px;line-height:1.7">Hi ${name}, click the button below to reset your password. This link expires in 15 minutes.</p>
      <a href="${resetUrl}" style="display:inline-block;margin-top:24px;background:linear-gradient(135deg,#1AEF22,#06B517);color:#000;text-decoration:none;padding:13px 28px;border-radius:11px;font-weight:800;font-size:14px">Reset Password →</a>
      <p style="color:#333;font-size:12px;margin-top:28px">If you didn't request this, ignore this email.</p>
    </div>
  `);
}

export async function sendMissionApprovedEmail(to: string, name: string, missionTitle: string, reward: number): Promise<void> {
  await sendEmail(to, `✅ Mission Approved — ${reward.toLocaleString()} QLT Credited`, `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#000;color:#F5F5F5;padding:32px;border-radius:16px">
      <img src="${APP_URL}/qeixova-icon.png" width="48" style="border-radius:12px;margin-bottom:20px" />
      <h1 style="font-size:20px;font-weight:900;color:#1AEF22;margin:0 0 8px">Mission Approved! ✅</h1>
      <p style="color:#888;font-size:14px;line-height:1.7">Hi ${name}, your submission for <strong style="color:#F5F5F5">${missionTitle}</strong> has been approved.</p>
      <div style="background:#111;border-radius:12px;padding:16px;margin:20px 0;border:1px solid #222">
        <p style="color:#888;font-size:12px;margin:0 0 4px">QLT Credited</p>
        <p style="color:#F5A623;font-size:28px;font-weight:900;margin:0">+${reward.toLocaleString()} QLT</p>
        <p style="color:#555;font-size:12px;margin:4px 0 0">≈ ₦${(reward / 100).toFixed(2)}</p>
      </div>
      <a href="${APP_URL}/wallet" style="display:inline-block;background:linear-gradient(135deg,#F5A623,#d89420);color:#000;text-decoration:none;padding:13px 28px;border-radius:11px;font-weight:800;font-size:14px">View Wallet →</a>
    </div>
  `);
}

export async function sendMissionRejectedEmail(to: string, name: string, missionTitle: string, reason: string): Promise<void> {
  await sendEmail(to, `Mission Submission Update — ${missionTitle}`, `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#000;color:#F5F5F5;padding:32px;border-radius:16px">
      <img src="${APP_URL}/qeixova-icon.png" width="48" style="border-radius:12px;margin-bottom:20px" />
      <h1 style="font-size:20px;font-weight:900;color:#e53e3e;margin:0 0 8px">Submission Not Approved</h1>
      <p style="color:#888;font-size:14px;line-height:1.7">Hi ${name}, your submission for <strong style="color:#F5F5F5">${missionTitle}</strong> was not approved.</p>
      <div style="background:#111;border-radius:12px;padding:16px;margin:20px 0;border:1px solid #222">
        <p style="color:#888;font-size:12px;margin:0 0 4px">Reason</p>
        <p style="color:#F5F5F5;font-size:14px;margin:0">${reason}</p>
      </div>
      <p style="color:#555;font-size:13px">Please review the mission requirements and try again.</p>
      <a href="${APP_URL}/tasks" style="display:inline-block;margin-top:16px;background:#111;border:1px solid #333;color:#F5F5F5;text-decoration:none;padding:12px 24px;border-radius:11px;font-weight:600;font-size:14px">Browse Missions →</a>
    </div>
  `);
}

export async function sendWithdrawalRequestedEmail(to: string, name: string, amount: number, bankLabel: string): Promise<void> {
  await sendEmail(to, `Withdrawal Request Received — ₦${(amount / 100).toLocaleString()}`, `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#000;color:#F5F5F5;padding:32px;border-radius:16px">
      <img src="${APP_URL}/qeixova-icon.png" width="48" style="border-radius:12px;margin-bottom:20px" />
      <h1 style="font-size:20px;font-weight:900;color:#F5F5F5;margin:0 0 8px">Withdrawal Requested 💸</h1>
      <p style="color:#888;font-size:14px;line-height:1.7">Hi ${name}, your withdrawal request has been received and is being processed.</p>
      <div style="background:#111;border-radius:12px;padding:16px;margin:20px 0;border:1px solid #222">
        <p style="color:#888;font-size:12px;margin:0 0 4px">Amount</p>
        <p style="color:#F5A623;font-size:24px;font-weight:900;margin:0 0 8px">₦${(amount / 100).toLocaleString()}</p>
        <p style="color:#888;font-size:12px;margin:0 0 4px">To</p>
        <p style="color:#F5F5F5;font-size:13px;margin:0">${bankLabel}</p>
      </div>
      <p style="color:#555;font-size:12px">Processing within 24 hours. Contact support if not received.</p>
    </div>
  `);
}

export async function sendBusinessWelcomeEmail(to: string, name: string): Promise<void> {
  await sendEmail(to, "Welcome to Qeixova Business Portal", `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#000;color:#F5F5F5;padding:32px;border-radius:16px">
      <img src="${APP_URL}/qeixova-icon.png" width="48" style="border-radius:12px;margin-bottom:20px" />
      <h1 style="font-size:22px;font-weight:900;color:#F5A623;margin:0 0 8px">Welcome, ${name}!</h1>
      <p style="color:#888;font-size:14px;line-height:1.7">Your business account is ready. Create campaigns, target your audience, and pay only for verified completions.</p>
      <a href="${APP_URL}/business/tasks/new" style="display:inline-block;margin-top:24px;background:linear-gradient(135deg,#F5A623,#d89420);color:#000;text-decoration:none;padding:13px 28px;border-radius:11px;font-weight:800;font-size:14px">Create First Campaign →</a>
    </div>
  `);
}

export async function sendCampaignLiveEmail(to: string, businessName: string, campaignTitle: string): Promise<void> {
  await sendEmail(to, `Campaign Live: ${campaignTitle}`, `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#000;color:#F5F5F5;padding:32px;border-radius:16px">
      <img src="${APP_URL}/qeixova-icon.png" width="48" style="border-radius:12px;margin-bottom:20px" />
      <h1 style="font-size:20px;font-weight:900;color:#1AEF22;margin:0 0 8px">Campaign is Live! 🚀</h1>
      <p style="color:#888;font-size:14px;line-height:1.7">Hi ${businessName}, your campaign <strong style="color:#F5F5F5">${campaignTitle}</strong> has been approved and is now visible to your target audience.</p>
      <a href="${APP_URL}/business/tasks" style="display:inline-block;margin-top:24px;background:linear-gradient(135deg,#F5A623,#d89420);color:#000;text-decoration:none;padding:13px 28px;border-radius:11px;font-weight:800;font-size:14px">View Campaign →</a>
    </div>
  `);
}
