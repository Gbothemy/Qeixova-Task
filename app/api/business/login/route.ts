import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";
import { signBusinessToken } from "@/lib/businessAuth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "Email and password required" }, { status: 400 });

    const rows = await sql`SELECT * FROM businesses WHERE email = ${email}`;
    if (rows.length === 0) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

    const business = rows[0];
    const valid = await bcrypt.compare(password, business.password);
    if (!valid) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

    const token = signBusinessToken({ businessId: business.id, email: business.email, name: business.name });

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
