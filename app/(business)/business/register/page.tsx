"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const INDUSTRIES = ["Technology","Food & Beverage","Fashion & Beauty","Finance & Banking","Healthcare","Education","Entertainment","Real Estate","E-commerce","Marketing & Advertising","Other"];

export default function BusinessRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", industry: "", website: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/business/register", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) router.push("/business/dashboard");
    else setError(data.error || "Registration failed");
    setLoading(false);
  };

  const inp = {
    width: "100%", marginTop: 6, padding: "13px 14px",
    borderRadius: 12, border: "1.5px solid #2a2a2a",
    fontSize: 14, outline: "none", color: "#F5F5F5", background: "#111111",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#000000", display: "flex", flexDirection: "column" }}>
      <nav style={{ padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #111" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <Image src="/qeixova-icon.png" alt="Qeixova" width={32} height={32} style={{ borderRadius: 9, objectFit: "contain" }} />
          <span style={{ fontWeight: 800, fontSize: 16, color: "#F5F5F5" }}>Qeixova</span>
          <span style={{ fontSize: 11, color: "#555", background: "#111", border: "1px solid #222", borderRadius: 6, padding: "2px 8px", fontWeight: 600 }}>Business</span>
        </Link>
        <Link href="/business/login" style={{ fontSize: 13, color: "#F5A623", fontWeight: 700, textDecoration: "none" }}>Sign in →</Link>
      </nav>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 20px" }}>
        <div style={{ width: "100%", maxWidth: 460 }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 20 }}>
              <Image src="/qeixova-logo.png" alt="Qeixova" width={48} height={48} style={{ objectFit: "contain" }} />
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: "#F5F5F5", marginBottom: 6, letterSpacing: -0.5 }}>Create Business Account</h1>
            <p style={{ fontSize: 14, color: "#666" }}>Start reaching your target audience on Qeixova</p>
          </div>

          {/* Value props */}
          <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap", justifyContent: "center" }}>
            {["Pay per completion", "Verified users", "Full targeting control"].map(t => (
              <span key={t} style={{ fontSize: 12, color: "#F5A623", background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.2)", borderRadius: 20, padding: "4px 12px", fontWeight: 600 }}>
                ✓ {t}
              </span>
            ))}
          </div>

          <div style={{ background: "#0d0d0d", borderRadius: 20, padding: "28px 24px", border: "1px solid #1a1a1a" }}>
            {error && (
              <div style={{ background: "rgba(229,62,62,0.08)", border: "1px solid rgba(229,62,62,0.25)", borderRadius: 10, padding: "11px 14px", marginBottom: 20, fontSize: 13, color: "#e53e3e" }}>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { key: "name",     label: "BUSINESS NAME",     type: "text",     placeholder: "Your company name",          required: true },
                { key: "email",    label: "BUSINESS EMAIL",    type: "email",    placeholder: "contact@company.com",        required: true },
                { key: "password", label: "PASSWORD",          type: "password", placeholder: "Create a strong password",   required: true },
                { key: "website",  label: "WEBSITE (OPTIONAL)",type: "url",      placeholder: "https://yourwebsite.com",    required: false },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#555", letterSpacing: 0.8 }}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={form[f.key as keyof typeof form]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} required={f.required} style={inp}
                    onFocus={e => (e.target.style.borderColor = "#F5A623")} onBlur={e => (e.target.style.borderColor = "#2a2a2a")} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#555", letterSpacing: 0.8 }}>INDUSTRY</label>
                <select value={form.industry} onChange={e => setForm(p => ({ ...p, industry: e.target.value }))}
                  style={{ ...inp, cursor: "pointer" }}>
                  <option value="">Select industry</option>
                  {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <button type="submit" disabled={loading} style={{
                background: loading ? "#1a1a1a" : "linear-gradient(135deg, #F5A623, #d89420)",
                color: loading ? "#555" : "#000", border: "none", borderRadius: 12,
                padding: "14px", fontWeight: 800, fontSize: 15, cursor: loading ? "not-allowed" : "pointer",
                marginTop: 4, boxShadow: loading ? "none" : "0 6px 20px rgba(245,166,35,0.3)",
              }}>
                {loading ? "Creating account..." : "Create Account →"}
              </button>
            </form>
            <p style={{ textAlign: "center", fontSize: 13, color: "#444", marginTop: 20 }}>
              Already have an account?{" "}
              <Link href="/business/login" style={{ color: "#F5A623", fontWeight: 700, textDecoration: "none" }}>Sign in</Link>
            </p>
          </div>

          <p style={{ textAlign: "center", fontSize: 12, color: "#333", marginTop: 20 }}>
            Looking to earn?{" "}
            <Link href="/register" style={{ color: "#1AEF22", textDecoration: "none", fontWeight: 600 }}>User sign up →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
