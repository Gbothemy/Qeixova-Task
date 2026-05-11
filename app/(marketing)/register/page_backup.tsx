"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email, password: form.password }),
    });
    const data = await res.json();
    if (res.ok) {
      router.push("/dashboard");
    } else {
      setError(data.error || "Login failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #1AEF22 0%, #06B517 45%, #000000 45%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px 16px",
    }}>
      {/* Decorative blobs */}
      <div style={{
        position: "fixed", top: -80, right: -80,
        width: 320, height: 320, borderRadius: "50%",
        background: "rgba(245,166,35,0.1)", pointerEvents: "none",
      }} />
      <div style={{
        position: "fixed", top: 60, left: -60,
        width: 200, height: 200, borderRadius: "50%",
        background: "rgba(255,255,255,0.06)", pointerEvents: "none",
      }} />

      <div style={{ width: "100%", maxWidth: 440 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/landing" style={{ textDecoration: "none", display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <img 
              src="/qeixova-icon.png" 
              alt="Qeixova" 
              style={{
                width: 56, 
                height: 56, 
                borderRadius: 16,
                objectFit: "contain",
                boxShadow: "0 8px 24px rgba(26,239,34,0.4)",
              }}
            />
            <span style={{ fontWeight: 900, fontSize: 22, color: "#fff", letterSpacing: -0.5 }}>Qeixova</span>
          </Link>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, marginTop: 6 }}>
            Welcome back — let&apos;s get you earning
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "#111111",
          borderRadius: 24,
          padding: "36px 32px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          border: "1px solid #222222",
        }}>
          <h1 style={{ fontWeight: 800, fontSize: 22, color: "#F5F5F5", marginBottom: 6 }}>
            Sign in
          </h1>
          <p style={{ fontSize: 13, color: "#555555", marginBottom: 28 }}>
            Don&apos;t have an account?{" "}
            <Link href="/register" style={{ color: "#1AEF22", fontWeight: 700, textDecoration: "none" }}>
              Create one free
            </Link>
          </p>

          {error && (
            <div style={{
              background: "rgba(229,62,62,0.1)", border: "1px solid rgba(229,62,62,0.3)",
              borderRadius: 10, padding: "11px 14px", marginBottom: 20,
              fontSize: 13, color: "#e53e3e", fontWeight: 500,
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>

            {/* Email */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#555555", letterSpacing: 0.5 }}>
                EMAIL ADDRESS
              </label>
              <div style={{ position: "relative", marginTop: 8 }}>
                <span style={{
                  position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                  fontSize: 16, pointerEvents: "none",
                }}>📧</span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={{
                    width: "100%", padding: "13px 14px 13px 42px",
                    borderRadius: 12, border: "1.5px solid #333333",
                    fontSize: 14, outline: "none", color: "#F5F5F5",
                    background: "#1a1a1a", transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#1AEF22")}
                  onBlur={(e) => (e.target.style.borderColor = "#333333")}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#555555", letterSpacing: 0.5 }}>
                  PASSWORD
                </label>
                <Link href="/forgot-password" style={{ fontSize: 12, color: "#1AEF22", fontWeight: 600, textDecoration: "none" }}>
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: "relative", marginTop: 8 }}>
                <span style={{
                  position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                  fontSize: 16, pointerEvents: "none",
                }}>🔒</span>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  style={{
                    width: "100%", padding: "13px 44px 13px 42px",
                    borderRadius: 12, border: "1.5px solid #333333",
                    fontSize: 14, outline: "none", color: "#F5F5F5",
                    background: "#1a1a1a", transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#1AEF22")}
                  onBlur={(e) => (e.target.style.borderColor = "#333333")}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", fontSize: 16, padding: 0,
                  }}
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? "#a0a0a0" : "linear-gradient(135deg, #1AEF22, #06B517)",
                color: "#fff", border: "none",
                borderRadius: 14, padding: "15px",
                fontWeight: 800, fontSize: 15, cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 6px 20px rgba(26,239,34,0.35)",
                transition: "all 0.2s", marginTop: 4,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              {loading ? (
                <>
                  <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⏳</span>
                  Signing in...
                </>
              ) : "Sign In →"}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
            <div style={{ flex: 1, height: 1, background: "#222222" }} />
            <span style={{ fontSize: 12, color: "#555555", fontWeight: 500 }}>or continue with</span>
            <div style={{ flex: 1, height: 1, background: "#222222" }} />
          </div>

          {/* Social buttons */}
          <div style={{ display: "flex", gap: 10 }}>
            {[{ icon: "🇬", label: "Google" }, { icon: "📘", label: "Facebook" }].map((s) => (
              <button key={s.label} style={{
                flex: 1, padding: "11px",
                background: "#1a1a1a", border: "1.5px solid #333333",
                borderRadius: 12, cursor: "pointer", fontWeight: 600,
                fontSize: 13, color: "#F5F5F5",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}>
                <span style={{ fontSize: 16 }}>{s.icon}</span> {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <p style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 20 }}>
          By signing in you agree to our{" "}
          <span style={{ color: "rgba(255,255,255,0.8)", cursor: "pointer" }}>Terms</span> &amp;{" "}
          <span style={{ color: "rgba(255,255,255,0.8)", cursor: "pointer" }}>Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}

