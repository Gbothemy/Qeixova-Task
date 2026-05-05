import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";
import { signToken } from "@/lib/auth";

function makeReferralCode(name: string): string {
  const prefix = name.slice(0, 4).toUpperCase().replace(/\s/g, "");
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${suffix}`;
}

export async function POST(req: NextRequest) {
  try {
    const { email, phone, fullName, password, referralCode } = await req.json();

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Referral code is optional
    let referrerId: number | null = null;
    if (referralCode && referralCode.trim()) {
      const refRows = await sql`SELECT id FROM users WHERE referral_code = ${referralCode.trim().toUpperCase()}`;
      if (refRows.length === 0) {
        return NextResponse.json({ error: "Invalid referral code. Please check and try again." }, { status: 400 });
      }
      referrerId = refRows[0].id;
    }

    // Check existing user
    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length > 0) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const myCode = makeReferralCode(fullName);

    const result = await sql`
      INSERT INTO users (email, phone, full_name, password, referral_code, referred_by, balance)
      VALUES (${email}, ${phone || null}, ${fullName}, ${hashed}, ${myCode}, ${referrerId}, 1000)
      RETURNING id, email, full_name
    `;

    const user = result[0];

    // Credit referrer bonus
    if (referrerId) {
      await sql`UPDATE users SET balance = balance + 2500 WHERE id = ${referrerId}`;
      await sql`
        INSERT INTO transactions (user_id, type, amount, label)
        VALUES (${referrerId}, 'credit', 2500, 'Referral Bonus')
      `;
    }

    const token = signToken({ userId: user.id, email: user.email, fullName: user.full_name });

    const res = NextResponse.json({ ok: true, user: { id: user.id, email: user.email, fullName: user.full_name } });
    res.cookies.set("auth_token", token, {
      httpOnly: true, secure: process.env.NODE_ENV === "production",
      sameSite: "lax", maxAge: 60 * 60 * 24 * 7, path: "/",
    });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
