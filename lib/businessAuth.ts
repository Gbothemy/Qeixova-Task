import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

function getBusinessJwtSecret() {
  if (process.env.JWT_SECRET) return `${process.env.JWT_SECRET}_business`;
  if (process.env.NODE_ENV !== "production") return "dev-jwt-secret_business";
  throw new Error("JWT_SECRET environment variable is required in production");
}

export interface BusinessJWTPayload {
  businessId: number;
  email: string;
  name: string;
}

export function signBusinessToken(payload: BusinessJWTPayload): string {
  return jwt.sign(payload, getBusinessJwtSecret(), { expiresIn: "7d" });
}

export function verifyBusinessToken(token: string): BusinessJWTPayload | null {
  try {
    return jwt.verify(token, getBusinessJwtSecret()) as BusinessJWTPayload;
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
