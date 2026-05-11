"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ 
    fullName: "", 
    email: "", 
    password: "", 
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password || !form.confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!termsAccepted) {
      setError("Please accept the Terms of Service to continue.");
      return;
    }
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        fullName: form.fullName, 
        email: form.email, 
        password: form.password
      }),
    });
    const data = await res.json();
    if (res.ok) {
      router.push("/dashboard");
    } else {
      setError(data.error || "Registration failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px 16px",
    }}>
      <div style={{
        position: "fixed", top: -80, right: -80,
        width: 320, height: 320, borderRadius: "50%",
        background: "rgba(26,239,34,0.03)", pointerEvents: "none",
      }} />
      <div style={{
        position: "fixed", top: 60, left: -60,
        width: 200, height: 200, borderRadius: "50%",
        background: "rgba(245,166,35,0.03)", pointerEvents: "none",
      }} />

      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/" style={{ textDecoration: "none", display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
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
            Join thousands earning daily
          </p>
        </div>

        <div style={{
          background: "#111111",
          borderRadius: 24,
          padding: "36px 32px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          border: "1px solid #222222",
        }}>
          <h1 style={{ fontWeight: 800, fontSize: 22, color: "#F5F5F5", marginBottom: 6 }}>
            Create Account
          </h1>
          <p style={{ fontSize: 13, color: "#555555", marginBottom: 28 }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#1AEF22", fontWeight: 700, textDecoration: "none" }}>
              Sign in
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
            
            {/* Personal Information Section */}
            <div style={{ marginBottom: 8 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1AEF22", marginBottom: 16, letterSpacing: 0.5 }}>
                📋 PERSONAL INFORMATION
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#555555", letterSpacing: 0.5 }}>
                    FULL NAME *
                  </label>
                  <div style={{ position: "relative", marginTop: 8 }}>
                    <span style={{
                      position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                      fontSize: 16, pointerEvents: "none",
                    }}>👤</span>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      required
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

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#555555", letterSpacing: 0.5 }}>
                    EMAIL ADDRESS *
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
                      required
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
              </div>
            </div>

            {/* Security Section */}
            <div style={{ marginBottom: 8 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1AEF22", marginBottom: 16, letterSpacing: 0.5 }}>
                🔐 SECURITY
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#555555", letterSpacing: 0.5 }}>
                    PASSWORD *
                  </label>
                  <div style={{ position: "relative", marginTop: 8 }}>
                    <span style={{
                      position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                      fontSize: 16, pointerEvents: "none",
                    }}>🔒</span>
                    <input
                      type={showPass ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
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

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#555555", letterSpacing: 0.5 }}>
                    CONFIRM PASSWORD *
                  </label>
                  <div style={{ position: "relative", marginTop: 8 }}>
                    <span style={{
                      position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                      fontSize: 16, pointerEvents: "none",
                    }}>🔒</span>
                    <input
                      type={showConfirmPass ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      required
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
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      style={{
                        position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                        background: "none", border: "none", cursor: "pointer", fontSize: 16, padding: 0,
                      }}
                    >
                      {showConfirmPass ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !termsAccepted}
              style={{
                background: loading ? "#a0a0a0" : !termsAccepted ? "#333" : "linear-gradient(135deg, #1AEF22, #06B517)",
                color: !termsAccepted ? "#666" : "#fff", border: "none",
                borderRadius: 14, padding: "15px",
                fontWeight: 800, fontSize: 15, cursor: (loading || !termsAccepted) ? "not-allowed" : "pointer",
                boxShadow: (loading || !termsAccepted) ? "none" : "0 6px 20px rgba(26,239,34,0.35)",
                transition: "all 0.2s", marginTop: 4,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              {loading ? (
                <>
                  <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⏳</span>
                  Creating account...
                </>
              ) : "Create Account →"}
            </button>

            {/* Terms checkbox */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginTop: 12 }}>
              <input type="checkbox" id="terms" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)}
                style={{ marginTop: 2, accentColor: "#1AEF22", width: 16, height: 16, cursor: "pointer", flexShrink: 0 }} />
              <label htmlFor="terms" style={{ fontSize: 12, color: "#555", lineHeight: 1.5, cursor: "pointer" }}>
                I agree to the{" "}
                <Link href="/#" style={{ color: "#1AEF22", textDecoration: "none", fontWeight: 600 }}>Terms of Service</Link>
                {" "}and{" "}
                <Link href="/#" style={{ color: "#1AEF22", textDecoration: "none", fontWeight: 600 }}>Privacy Policy</Link>
              </label>
            </div>
          </form>
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 20 }}>
          By creating an account you agree to our{" "}
          <span style={{ color: "rgba(255,255,255,0.8)", cursor: "pointer" }}>Terms</span> &amp;{" "}
          <span style={{ color: "rgba(255,255,255,0.8)", cursor: "pointer" }}>Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}
