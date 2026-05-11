import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET = process.env.JWT_SECRET || "fallback-secret-change-in-prod";

export interface BusinessJWTPayload {
  businessId: number;
  email: string;
  name: string;
}

export function signBusinessToken(payload: BusinessJWTPayload): string {
  return jwt.sign(payload, SECRET + "_business", { expiresIn: "7d" });
}

export function verifyBusinessToken(token: string): BusinessJWTPayload | null {
  try {
    return jwt.verify(token, SECRET + "_business") as BusinessJWTPayload;
  } catch {
    return null;
  }
}

export async function getBusinessSession(): Promise<BusinessJWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("business_token")?.value;
  if (!token) return null;
  return verifyBusinessToken(token);
}
