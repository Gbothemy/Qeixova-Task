import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import jwt from "jsonwebtoken";
import { sendPasswordResetEmail } from "@/lib/email";

const SECRET = process.env.JWT_SECRET || "fallback-secret";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const rows = await sql`SELECT id, email, full_name FROM users WHERE email = ${email.toLowerCase().trim()}`;

    // Always return success to prevent email enumeration
    if (rows.length === 0) {
      return NextResponse.json({ ok: true });
    }

    const user = rows[0];
    // Generate a short-lived reset token (15 min)
    const token = jwt.sign({ userId: user.id, purpose: "reset" }, SECRET, { expiresIn: "15m" });

    // Store token in DB
    await sql`
      INSERT INTO password_resets (user_id, token, expires_at)
      VALUES (${user.id}, ${token}, NOW() + INTERVAL '15 minutes')
      ON CONFLICT (user_id) DO UPDATE SET token = ${token}, expires_at = NOW() + INTERVAL '15 minutes'
    `;

    // Send reset email
    await sendPasswordResetEmail(user.email, user.full_name, token);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
