"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Redirect to unified registration flow
export default function BusinessRegisterRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace("/register"); }, [router]);
  return null;
}
