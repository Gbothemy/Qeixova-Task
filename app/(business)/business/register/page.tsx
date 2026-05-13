"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  "Local Business", "Music & Entertainment", "Creator Brand",
  "Startup / App", "Church / Community", "Event Promotion",
  "E-commerce", "Personal Brand", "Other",
];

const GOALS = [
  "Increase awareness", "Promote content", "Get reposts",
  "Gain community visibility", "Grow social pages", "Get app testers",
  "Generate referrals", "Gather feedback", "Promote events", "Build audience engagement",
];

const inp: React.CSSProperties = {
  width: "100%", marginTop: 7, padding: "13px 14px",
  borderRadius: 11, border: "1.5px solid #1e1e1e",
  fontSize: 14, outline: "none", color: "#F5F5F5", background: "#0d0d0d",
};

function StepBar({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 24 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ flex: 1, height: 3, borderRadius: 3, background: i < current ? "#F5A623" : "#1a1a1a", transition: "background 0.3s" }} />
      ))}
      <span style={{ fontSize: 11, color: "#444", flexShrink: 0 }}>{current}/{total}</span>
    </div>
  );
}

export default function BusinessRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 0 — account
  const [account, setAccount] = useState({ name: "", email: "", password: "", website: "" });

  // Step 1 — business setup
  const [setup, setSetup] = useState({ category: "", description: "", country: "Nigeria" });

  // Step 2 — goals
  const [goals, setGoals] = useState<string[]>([]);

  const toggleGoal = (g: string) => setGoals(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);

  const handleSubmit = async () => {
    setLoading(true); setError("");
    const res = await fetch("/api/business/register", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: account.name, email: account.email,
        password: account.password, website: account.website,
        industry: setup.category,
        description: setup.description,
        goals,
      }),
    });
    const data = await res.json();
    if (res.ok) router.push("/business/dashboard");
    else setError(data.error || "Registration failed");
    setLoading(false);
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
        <div style={{ width: "100%", maxWidth: 480 }}>

          {/* ── STEP 0: Welcome ── */}
          {step === 0 && (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 64, height: 64, borderRadius: 20, background: "linear-gradient(135deg, #F5A623, #d89420)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: "0 8px 28px rgba(245,166,35,0.3)" }}>
                <Image src="/qeixova-icon.png" alt="Qeixova" width={36} height={36} style={{ objectFit: "contain", filter: "brightness(0)" }} />
              </div>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: "#F5F5F5", marginBottom: 8, letterSpacing: -0.5 }}>Create Business Account</h1>
              <p style={{ fontSize: 14, color: "#555", marginBottom: 28, lineHeight: 1.7 }}>
                Promote your business, music, events, products, videos, apps, or campaigns through real human participation.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 32 }}>
                {[
                  { icon: "/icon-create-mission.svg", label: "Launch campaigns" },
                  { icon: "/icon-target-audience.svg", label: "Target audience" },
                  { icon: "/icon-verified.svg", label: "Verified results" },
                ].map(f => (
                  <div key={f.label} style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 12, padding: "14px 10px", textAlign: "center" }}>
                    <Image src={f.icon} alt={f.label} width={22} height={22} style={{ objectFit: "contain", filter: "invert(72%) sepia(60%) saturate(500%) hue-rotate(5deg)", marginBottom: 8 }} />
                    <p style={{ fontSize: 11, color: "#555", fontWeight: 600 }}>{f.label}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => setStep(1)} style={{ width: "100%", background: "linear-gradient(135deg, #F5A623, #d89420)", color: "#000", border: "none", borderRadius: 13, padding: "15px", fontWeight: 800, fontSize: 15, cursor: "pointer", boxShadow: "0 6px 20px rgba(245,166,35,0.28)" }}>
                Create Business Account →
              </button>
              <p style={{ textAlign: "center", fontSize: 13, color: "#333", marginTop: 16 }}>
                Already have an account?{" "}
                <Link href="/business/login" style={{ color: "#F5A623", fontWeight: 700, textDecoration: "none" }}>Sign in</Link>
              </p>
            </div>
          )}

          {/* ── STEP 1: Account Details ── */}
          {step === 1 && (
            <div>
              <StepBar current={1} total={3} />
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#F5F5F5", marginBottom: 4 }}>Account Details</h2>
              <p style={{ fontSize: 13, color: "#555", marginBottom: 20 }}>Create your business login credentials.</p>

              {error && (
                <div style={{ background: "rgba(229,62,62,0.07)", border: "1px solid rgba(229,62,62,0.2)", borderRadius: 10, padding: "11px 14px", marginBottom: 16, fontSize: 13, color: "#e53e3e" }}>
                  ⚠️ {error}
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { key: "name",     label: "Business Name",      type: "text",     placeholder: "Your company or brand name" },
                  { key: "email",    label: "Business Email",     type: "email",    placeholder: "contact@yourbusiness.com" },
                  { key: "password", label: "Password",           type: "password", placeholder: "Create a strong password" },
                  { key: "website",  label: "Website (optional)", type: "url",      placeholder: "https://yourwebsite.com" },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#444", letterSpacing: 0.8, textTransform: "uppercase" }}>{f.label}</label>
                    <input type={f.type} placeholder={f.placeholder} value={account[f.key as keyof typeof account]}
                      onChange={e => setAccount(a => ({ ...a, [f.key]: e.target.value }))}
                      required={f.key !== "website"} style={inp}
                      onFocus={e => (e.target.style.borderColor = "#F5A623")} onBlur={e => (e.target.style.borderColor = "#1e1e1e")} />
                  </div>
                ))}
              </div>

              <button onClick={() => {
                if (!account.name || !account.email || !account.password) { setError("Name, email and password are required."); return; }
                setError(""); setStep(2);
              }} style={{ width: "100%", marginTop: 20, background: "linear-gradient(135deg, #F5A623, #d89420)", color: "#000", border: "none", borderRadius: 12, padding: "14px", fontWeight: 800, fontSize: 15, cursor: "pointer" }}>
                Continue →
              </button>
            </div>
          )}

          {/* ── STEP 2: Business Setup ── */}
          {step === 2 && (
            <div>
              <StepBar current={2} total={3} />
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#F5F5F5", marginBottom: 4 }}>Business Setup</h2>
              <p style={{ fontSize: 13, color: "#555", marginBottom: 20 }}>Tell us about your business so we can match you with the right contributors.</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#444", letterSpacing: 0.8, textTransform: "uppercase" }}>Business Category</label>
                  <select value={setup.category} onChange={e => setSetup(s => ({ ...s, category: e.target.value }))}
                    style={{ ...inp, cursor: "pointer" }}
                    onFocus={e => (e.target.style.borderColor = "#F5A623")} onBlur={e => (e.target.style.borderColor = "#1e1e1e")}>
                    <option value="">Select your category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#444", letterSpacing: 0.8, textTransform: "uppercase" }}>Business Description (optional)</label>
                  <textarea value={setup.description} onChange={e => setSetup(s => ({ ...s, description: e.target.value }))}
                    placeholder="Briefly describe your business, product, or campaign..."
                    rows={3} style={{ ...inp, resize: "vertical", lineHeight: 1.6 }}
                    onFocus={e => (e.target.style.borderColor = "#F5A623")} onBlur={e => (e.target.style.borderColor = "#1e1e1e")} />
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, padding: "13px", borderRadius: 12, border: "1.5px solid #1e1e1e", background: "transparent", color: "#555", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>← Back</button>
                <button onClick={() => setStep(3)} style={{ flex: 2, padding: "13px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #F5A623, #d89420)", color: "#000", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>Continue →</button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Goals ── */}
          {step === 3 && (
            <div>
              <StepBar current={3} total={3} />
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#F5F5F5", marginBottom: 4 }}>What would you like to achieve?</h2>
              <p style={{ fontSize: 13, color: "#555", marginBottom: 20 }}>Select all that apply — this helps us suggest the right campaign types.</p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
                {GOALS.map(g => {
                  const on = goals.includes(g);
                  return (
                    <button key={g} type="button" onClick={() => toggleGoal(g)} style={{
                      padding: "8px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer",
                      fontWeight: on ? 700 : 400,
                      border: `1.5px solid ${on ? "#F5A623" : "#1e1e1e"}`,
                      background: on ? "rgba(245,166,35,0.1)" : "transparent",
                      color: on ? "#F5A623" : "#555",
                    }}>{g}</button>
                  );
                })}
              </div>

              {error && (
                <div style={{ background: "rgba(229,62,62,0.07)", border: "1px solid rgba(229,62,62,0.2)", borderRadius: 10, padding: "11px 14px", marginBottom: 16, fontSize: 13, color: "#e53e3e" }}>
                  ⚠️ {error}
                </div>
              )}

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setStep(2)} style={{ flex: 1, padding: "13px", borderRadius: 12, border: "1.5px solid #1e1e1e", background: "transparent", color: "#555", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>← Back</button>
                <button onClick={handleSubmit} disabled={loading} style={{ flex: 2, padding: "13px", borderRadius: 12, border: "none", background: loading ? "#111" : "linear-gradient(135deg, #F5A623, #d89420)", color: loading ? "#444" : "#000", fontWeight: 800, fontSize: 14, cursor: loading ? "not-allowed" : "pointer", boxShadow: loading ? "none" : "0 6px 20px rgba(245,166,35,0.28)" }}>
                  {loading ? "Creating account..." : "Launch My Business →"}
                </button>
              </div>
              <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", marginTop: 10, padding: "10px", borderRadius: 12, border: "none", background: "transparent", color: "#444", fontSize: 12, cursor: "pointer" }}>
                Skip goals — create account
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
