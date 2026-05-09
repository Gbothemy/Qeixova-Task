"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const INDUSTRIES = ["Technology", "Food & Beverage", "Fashion & Beauty", "Finance & Banking", "Healthcare", "Education", "Entertainment", "Real Estate", "E-commerce", "Marketing & Advertising", "Other"];

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

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 460 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg, #1AEF22, #06B517)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 28 }}>🏢</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#F5F5F5", marginBottom: 6 }}>Create Business Account</h1>
          <p style={{ fontSize: 14, color: "#888888" }}>Start reaching your target audience on Qeixova</p>
        </div>

        <div style={{ background: "#111111", borderRadius: 20, padding: "32px 28px", border: "1px solid #222222" }}>
          {error && (
            <div style={{ background: "rgba(229,62,62,0.1)", border: "1px solid rgba(229,62,62,0.3)", borderRadius: 10, padding: "11px 14px", marginBottom: 20, fontSize: 13, color: "#e53e3e" }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { key: "name", label: "BUSINESS NAME", type: "text", placeholder: "Your company name", required: true },
              { key: "email", label: "BUSINESS EMAIL", type: "email", placeholder: "contact@company.com", required: true },
              { key: "password", label: "PASSWORD", type: "password", placeholder: "Create a strong password", required: true },
              { key: "website", label: "WEBSITE (OPTIONAL)", type: "url", placeholder: "https://yourwebsite.com", required: false },
            ].map(f => (
              <div key={f.key}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#666666", letterSpacing: 0.5 }}>{f.label}</label>
                <input type={f.type} placeholder={f.placeholder} value={form[f.key as keyof typeof form]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} required={f.required}
                  style={{ width: "100%", marginTop: 6, padding: "13px 14px", borderRadius: 12, border: "1.5px solid #333333", fontSize: 14, outline: "none", color: "#F5F5F5", background: "#1a1a1a" }}
                  onFocus={e => (e.target.style.borderColor = "#1AEF22")}
                  onBlur={e => (e.target.style.borderColor = "#333333")} />
              </div>
            ))}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#666666", letterSpacing: 0.5 }}>INDUSTRY</label>
              <select value={form.industry} onChange={e => setForm(p => ({ ...p, industry: e.target.value }))}
                style={{ width: "100%", marginTop: 6, padding: "13px 14px", borderRadius: 12, border: "1.5px solid #333333", fontSize: 14, outline: "none", color: "#F5F5F5", background: "#1a1a1a", cursor: "pointer" }}>
                <option value="">Select industry</option>
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <button type="submit" disabled={loading} style={{ background: loading ? "#333" : "linear-gradient(135deg, #1AEF22, #06B517)", color: "#000", border: "none", borderRadius: 12, padding: "14px", fontWeight: 800, fontSize: 15, cursor: "pointer", marginTop: 4 }}>
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </form>
          <p style={{ textAlign: "center", fontSize: 13, color: "#555555", marginTop: 20 }}>
            Already have an account?{" "}
            <Link href="/business/login" style={{ color: "#1AEF22", fontWeight: 700, textDecoration: "none" }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
