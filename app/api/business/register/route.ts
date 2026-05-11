import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";
import { signBusinessToken } from "@/lib/businessAuth";
import { sendBusinessWelcomeEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, industry, website } = await req.json();
    if (!name || !email || !password) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    const existing = await sql`SELECT id FROM businesses WHERE email = ${email}`;
    if (existing.length > 0) return NextResponse.json({ error: "Email already registered" }, { status: 409 });

    const hashed = await bcrypt.hash(password, 10);
    const result = await sql`
      INSERT INTO businesses (name, email, password, industry, website)
      VALUES (${name}, ${email}, ${hashed}, ${industry || null}, ${website || null})
      RETURNING id, name, email
    `;

    const business = result[0];
    const token = signBusinessToken({ businessId: business.id, email: business.email, name: business.name });

    // Send welcome email (non-blocking)
    sendBusinessWelcomeEmail(business.email, business.name).catch(() => {});

    const res = NextResponse.json({ ok: true, business: { id: business.id, name: business.name, email: business.email } });
    res.cookies.set("business_token", token, {
      httpOnly: true, secure: process.env.NODE_ENV === "production",
      sameSite: "lax", maxAge: 60 * 60 * 24 * 7, path: "/",
    });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
