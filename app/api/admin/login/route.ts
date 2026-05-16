import { NextRequest, NextResponse } from "next/server";
import { getAdminToken } from "@/lib/adminAuth";

function getAdminCredentials() {
  const isProd = process.env.NODE_ENV === "production";
  const adminSecret = process.env.ADMIN_SECRET ?? "";

  return {
    email: process.env.ADMIN_EMAIL ?? (isProd ? "admin@qeixova.com" : "admin@qeixova.com"),
    password: process.env.ADMIN_PASSWORD ?? (isProd ? adminSecret : "Qeixova@Admin2025"),
  };
}

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const admin = getAdminCredentials();

  if (!admin.email || !admin.password) {
    return NextResponse.json({ error: "Admin login is not configured" }, { status: 503 });
  }
  if (email === admin.email && password === admin.password) {
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
