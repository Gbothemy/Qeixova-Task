import { cookies } from "next/headers";

const DEV_ADMIN_TOKEN = "qeixova-dev-admin-token";

export function getAdminToken() {
  if (process.env.ADMIN_SECRET) return process.env.ADMIN_SECRET;
  if (process.env.NODE_ENV !== "production") return DEV_ADMIN_TOKEN;
  throw new Error("ADMIN_SECRET environment variable is required in production");
}

export async function getAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  return token === getAdminToken();
}

export function checkAdminHeader(req: Request): boolean {
  const key = req.headers.get("x-admin-key");
  return Boolean(key) && key === getAdminToken();
}

export async function checkAdminAuth(req: Request): Promise<boolean> {
  if (checkAdminHeader(req)) return true;
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  return token === getAdminToken();
}
