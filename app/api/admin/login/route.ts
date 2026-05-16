import { NextRequest, NextResponse } from "next/server";
import { getAdminToken } from "@/lib/adminAuth";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? (process.env.NODE_ENV !== "production" ? "admin@qeixova.com" : "");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? (process.env.NODE_ENV !== "production" ? "Qeixova@Admin2025" : "");

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Admin login is not configured" }, { status: 503 });
  }
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set("admin_token", getAdminToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8, // 8 hours
      path: "/",
    });
    return res;
  }
  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}
