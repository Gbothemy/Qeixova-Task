import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

function getResetSecret() {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  if (process.env.NODE_ENV !== "production") return "dev-jwt-secret";
  throw new Error("JWT_SECRET environment variable is required in production");
}

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();
    if (!token || !password) return NextResponse.json({ error: "Token and password required" }, { status: 400 });
    if (password.length < 6) return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });

    // Verify JWT
    let payload: { userId: number; purpose: string };
    try {
      payload = jwt.verify(token, getResetSecret()) as { userId: number; purpose: string };
    } catch {
      return NextResponse.json({ error: "Reset link has expired. Please request a new one." }, { status: 400 });
    }

    if (payload.purpose !== "reset") {
      return NextResponse.json({ error: "Invalid reset token" }, { status: 400 });
    }

    // Check token exists in DB and not expired
    const rows = await sql`
      SELECT id FROM password_resets
      WHERE user_id = ${payload.userId} AND token = ${token} AND expires_at > NOW()
    `;
    if (rows.length === 0) {
      return NextResponse.json({ error: "Reset link has expired or already been used." }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);
    await sql`UPDATE users SET password = ${hashed} WHERE id = ${payload.userId}`;
    await sql`DELETE FROM password_resets WHERE user_id = ${payload.userId}`;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
