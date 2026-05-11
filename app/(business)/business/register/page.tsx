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

  const inp: React.CSSProperties = {
    width: "100%", marginTop: 7, padding: "13px 14px",
    borderRadius: 11, border: "1.5px solid #1e1e1e",
    fontSize: 14, outline: "none", color: "#F5F5F5", background: "#0d0d0d",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050505", display: "flex", flexDirection: "column" }}>
      <nav style={{ padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #111" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <Image src="/qeixova-icon.png" alt="Qeixova" width={30} height={30} style={{ borderRadius: 8, objectFit: "contain" }} />
          <span style={{ fontWeight: 800, fontSize: 15, color: "#F5F5F5" }}>Qeixova</span>
          <span style={{ fontSize: 10, color: "#F5A623", background: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.2)", borderRadius: 6, padding: "2px 8px", fontWeight: 700, letterSpacing: 0.5 }}>BUSINESS</span>
        </Link>
        <Link href="/business/login" style={{ fontSize: 13, color: "#F5A623", fontWeight: 700, textDecoration: "none" }}>Sign in →</Link>
      </nav>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 20px" }}>
        <div style={{ width: "100%", maxWidth: 460 }}>

          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: "linear-gradient(135deg, #F5A623, #d89420)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: "0 8px 28px rgba(245,166,35,0.3)" }}>
              <Image src="/qeixova-icon.png" alt="Qeixova" width={36} height={36} style={{ objectFit: "contain", filter: "brightness(0)" }} />
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: "#F5F5F5", marginBottom: 6, letterSpacing: -0.5 }}>Create Business Account</h1>
            <p style={{ fontSize: 14, color: "#555" }}>Start reaching your target audience on Qeixova</p>
          </div>

          {/* Value props */}
          <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { icon: "/icon-task.png", label: "Pay per completion" },
              { icon: "/icon-profile.png", label: "Verified users" },
              { icon: "/icon-survey.png", label: "Full targeting" },
            ].map(t => (
              <div key={t.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#F5A623", background: "rgba(245,166,35,0.07)", border: "1px solid rgba(245,166,35,0.15)", borderRadius: 20, padding: "5px 12px", fontWeight: 600 }}>
                <Image src={t.icon} alt={t.label} width={12} height={12} style={{ objectFit: "contain", filter: "invert(72%) sepia(60%) saturate(500%) hue-rotate(5deg)" }} />
                {t.label}
              </div>
            ))}
          </div>

          <div style={{ background: "#0a0a0a", borderRadius: 20, padding: "28px 24px", border: "1px solid #161616" }}>
            {error && (
              <div style={{ background: "rgba(229,62,62,0.07)", border: "1px solid rgba(229,62,62,0.2)", borderRadius: 10, padding: "11px 14px", marginBottom: 20, fontSize: 13, color: "#e53e3e", display: "flex", alignItems: "center", gap: 8 }}>
                <span>⚠️</span> {error}
              </div>
            )}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { key: "name",     label: "Business Name",     type: "text",     placeholder: "Your company name",        required: true },
                { key: "email",    label: "Business Email",    type: "email",    placeholder: "contact@company.com",      required: true },
                { key: "password", label: "Password",          type: "password", placeholder: "Create a strong password", required: true },
                { key: "website",  label: "Website (optional)",type: "url",      placeholder: "https://yourwebsite.com",  required: false },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#444", letterSpacing: 0.8, textTransform: "uppercase" }}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={form[f.key as keyof typeof form]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} required={f.required} style={inp}
                    onFocus={e => (e.target.style.borderColor = "#F5A623")} onBlur={e => (e.target.style.borderColor = "#1e1e1e")} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#444", letterSpacing: 0.8, textTransform: "uppercase" }}>Industry</label>
                <select value={form.industry} onChange={e => setForm(p => ({ ...p, industry: e.target.value }))}
                  style={{ ...inp, cursor: "pointer" }}
                  onFocus={e => (e.target.style.borderColor = "#F5A623")} onBlur={e => (e.target.style.borderColor = "#1e1e1e")}>
                  <option value="">Select your industry</option>
                  {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <button type="submit" disabled={loading} style={{
                background: loading ? "#111" : "linear-gradient(135deg, #F5A623, #d89420)",
                color: loading ? "#444" : "#000", border: "none", borderRadius: 12,
                padding: "14px", fontWeight: 800, fontSize: 15,
                cursor: loading ? "not-allowed" : "pointer", marginTop: 6,
                boxShadow: loading ? "none" : "0 6px 20px rgba(245,166,35,0.28)",
              }}>
                {loading ? "Creating account..." : "Create Account →"}
              </button>
            </form>
            <p style={{ textAlign: "center", fontSize: 13, color: "#333", marginTop: 20 }}>
              Already have an account?{" "}
              <Link href="/business/login" style={{ color: "#F5A623", fontWeight: 700, textDecoration: "none" }}>Sign in</Link>
            </p>
          </div>

          <p style={{ textAlign: "center", fontSize: 12, color: "#222", marginTop: 20 }}>
            Looking to earn?{" "}
            <Link href="/register" style={{ color: "#1AEF22", textDecoration: "none", fontWeight: 600 }}>User sign up →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
