"use client";
import { useState } from "react";
import Image from "next/image";
import TutorialFlow from "@/components/TutorialFlow";

interface Props {
  userName: string;
  onComplete: () => void;
}

// Step 2 — Intro cards
const INTRO_CARDS = [
  {
    icon: "/icon-task.png",
    title: "Complete Tasks",
    body: "Choose from simple tasks like social actions, surveys, and app testing.",
  },
  {
    icon: "/icon-wallet.png",
    title: "Earn QLT",
    body: "Each completed task earns you QLT points.",
  },
  {
    icon: "/icon-wallet.png",
    title: "Convert to Naira",
    body: "100 QLT = ₦1. Track and convert your earnings anytime.",
  },
];

// Guided overlay highlights
const HIGHLIGHTS = [
  { label: "Task Feed", hint: "Start here — available tasks", icon: "/icon-task.png" },
  { label: "QLT Balance", hint: "Your earnings appear here", icon: "/icon-wallet.png" },
  { label: "Profile / Wallet", hint: "Manage your account and earnings", icon: "/icon-profile.png" },
];

export default function OnboardingFlow({ userName, onComplete }: Props) {
  // Steps: 0=welcome, 1=profile, 2=bank, 3=referral, 4=intro cards, 5=guided overlay
  const [step, setStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);
  const [profile, setProfile] = useState({ username: "", country: "Nigeria" });
  const [bank, setBank] = useState({ bank_name: "", account_number: "", account_name: "" });
  const [referralCode, setReferralCode] = useState("");
  const [saving, setSaving] = useState(false);

  const firstName = userName?.split(" ")[0] ?? "there";

  const handleFinish = async () => {
    setSaving(true);
    await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...bank, referralCode }),
    });
    setSaving(false);
    setStep(5); // go to guided overlay
  };

  const handleDone = () => setShowTutorial(true);

  const inputStyle = {
    width: "100%", padding: "13px 14px",
    borderRadius: 12, border: "1.5px solid #333333",
    fontSize: 14, outline: "none", color: "#F5F5F5",
    background: "#1a1a1a",
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#000000",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, overflowY: "auto",
    }}>

      {/* Show tutorial after onboarding */}
      {showTutorial && <TutorialFlow onComplete={onComplete} />}

      {/* ── STEP 0: Welcome ── */}
      {step === 0 && (
        <div style={{ textAlign: "center", maxWidth: 400, width: "100%" }}>
          <img src="/qeixova-icon.png" alt="Qeixova" style={{ width: 80, height: 80, borderRadius: 22, objectFit: "contain", boxShadow: "0 8px 28px rgba(26,239,34,0.4)", marginBottom: 28 }} />
          <h1 style={{ fontSize: 28, fontWeight: 900, color: "#F5F5F5", letterSpacing: -1, marginBottom: 10 }}>
            Welcome to Qeixova Tasks
          </h1>
          <p style={{ fontSize: 15, color: "#b0b0b0", lineHeight: 1.7, marginBottom: 36 }}>
            You&apos;re now ready to start completing tasks and earning QLT.
          </p>
          <button onClick={() => setStep(1)} style={{
            width: "100%", background: "linear-gradient(135deg, #F5A623, #d89420)",
            color: "#000", border: "none", borderRadius: 14, padding: "16px",
            fontWeight: 800, fontSize: 16, cursor: "pointer",
            boxShadow: "0 6px 20px rgba(245,166,35,0.35)",
          }}>
            Start Setup →
          </button>
        </div>
      )}

      {/* ── STEP 1: Basic Profile ── */}
      {step === 1 && (
        <div style={{ maxWidth: 420, width: "100%" }}>
          <StepHeader current={1} total={3} />
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#F5F5F5", marginBottom: 6 }}>Basic Profile</h2>
          <p style={{ fontSize: 13, color: "#888888", marginBottom: 24 }}>Used to personalize your task feed.</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#666666", letterSpacing: 0.5 }}>USERNAME</label>
              <input
                type="text"
                placeholder="e.g. john_earner"
                value={profile.username}
                onChange={e => setProfile(p => ({ ...p, username: e.target.value }))}
                style={{ ...inputStyle, marginTop: 8 }}
                onFocus={e => (e.target.style.borderColor = "#1AEF22")}
                onBlur={e => (e.target.style.borderColor = "#333333")}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#666666", letterSpacing: 0.5 }}>COUNTRY</label>
              <select
                value={profile.country}
                onChange={e => setProfile(p => ({ ...p, country: e.target.value }))}
                style={{ ...inputStyle, marginTop: 8, cursor: "pointer" }}
              >
                <option value="Nigeria">Nigeria</option>
                <option value="Ghana">Ghana</option>
                <option value="Kenya">Kenya</option>
                <option value="South Africa">South Africa</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
            <button onClick={() => setStep(0)} style={{ flex: 1, padding: "14px", borderRadius: 12, border: "1.5px solid #333333", background: "transparent", color: "#888888", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>← Back</button>
            <button onClick={() => setStep(2)} style={{ flex: 2, padding: "14px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #1AEF22, #06B517)", color: "#000", fontWeight: 800, fontSize: 15, cursor: "pointer" }}>
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Payment Readiness ── */}
      {step === 2 && (
        <div style={{ maxWidth: 420, width: "100%" }}>
          <StepHeader current={2} total={3} />
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#F5F5F5", marginBottom: 6 }}>Set Up Your Earnings</h2>
          <p style={{ fontSize: 13, color: "#888888", marginBottom: 24 }}>This ensures your earnings can be converted when needed.</p>

          <div style={{ background: "#111111", borderRadius: 18, padding: "20px", border: "1px solid #222222", display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { key: "bank_name", label: "BANK NAME", placeholder: "e.g. GTBank, Opay, Palmpay" },
              { key: "account_number", label: "ACCOUNT NUMBER", placeholder: "10-digit account number" },
              { key: "account_name", label: "ACCOUNT NAME", placeholder: "Name on account" },
            ].map(f => (
              <div key={f.key}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#666666", letterSpacing: 0.5 }}>{f.label}</label>
                <input
                  type="text"
                  placeholder={f.placeholder}
                  value={bank[f.key as keyof typeof bank]}
                  onChange={e => setBank(b => ({ ...b, [f.key]: e.target.value }))}
                  style={{ ...inputStyle, marginTop: 6 }}
                  onFocus={e => (e.target.style.borderColor = "#1AEF22")}
                  onBlur={e => (e.target.style.borderColor = "#333333")}
                />
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
            <button onClick={() => setStep(1)} style={{ flex: 1, padding: "14px", borderRadius: 12, border: "1.5px solid #333333", background: "transparent", color: "#888888", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>← Back</button>
            <button onClick={() => setStep(3)} style={{ flex: 2, padding: "14px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #1AEF22, #06B517)", color: "#000", fontWeight: 800, fontSize: 15, cursor: "pointer" }}>
              Continue →
            </button>
          </div>
          <p style={{ fontSize: 11, color: "#555555", textAlign: "center", marginTop: 10 }}>You can update this anytime in Profile → Bank Accounts</p>
        </div>
      )}

      {/* ── STEP 3: Optional Referral ── */}
      {step === 3 && (
        <div style={{ maxWidth: 420, width: "100%" }}>
          <StepHeader current={3} total={3} />
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#F5F5F5", marginBottom: 6 }}>Have a referral code?</h2>
          <p style={{ fontSize: 13, color: "#888888", marginBottom: 24 }}>Optional — you can skip this step.</p>

          <input
            type="text"
            placeholder="Enter referral code (optional)"
            value={referralCode}
            onChange={e => setReferralCode(e.target.value.toUpperCase())}
            style={{ ...inputStyle, textTransform: "uppercase" }}
            onFocus={e => (e.target.style.borderColor = "#1AEF22")}
            onBlur={e => (e.target.style.borderColor = "#333333")}
          />

          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button onClick={() => setStep(2)} style={{ flex: 1, padding: "14px", borderRadius: 12, border: "1.5px solid #333333", background: "transparent", color: "#888888", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>← Back</button>
            <button onClick={handleFinish} disabled={saving} style={{ flex: 2, padding: "14px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #F5A623, #d89420)", color: "#000", fontWeight: 800, fontSize: 15, cursor: "pointer", boxShadow: "0 6px 20px rgba(245,166,35,0.35)" }}>
              {saving ? "Saving..." : "Continue →"}
            </button>
          </div>
          <button onClick={handleFinish} disabled={saving} style={{ width: "100%", marginTop: 12, padding: "12px", borderRadius: 12, border: "none", background: "transparent", color: "#555555", fontSize: 13, cursor: "pointer" }}>
            Skip for now
          </button>
        </div>
      )}

      {/* ── STEP 4: Intro Cards ── */}
      {step === 4 && (
        <div style={{ maxWidth: 400, width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 32 }}>
            {INTRO_CARDS.map((_, i) => (
              <div key={i} style={{ width: i === cardIndex ? 28 : 8, height: 8, borderRadius: 4, background: i === cardIndex ? "#1AEF22" : "#333333", transition: "all 0.3s" }} />
            ))}
          </div>

          <div style={{ background: "#111111", borderRadius: 24, padding: "44px 32px", border: "1px solid #222222", textAlign: "center", minHeight: 280 }}>
            <div style={{ width: 68, height: 68, borderRadius: 20, background: "rgba(26,239,34,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <Image src={INTRO_CARDS[cardIndex].icon} alt="" width={38} height={38} style={{ objectFit: "contain" }} />
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#F5F5F5", marginBottom: 14 }}>
              {INTRO_CARDS[cardIndex].title}
            </h2>
            <p style={{ fontSize: 15, color: "#b0b0b0", lineHeight: 1.7 }}>
              {INTRO_CARDS[cardIndex].body}
            </p>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
            {cardIndex > 0 && (
              <button onClick={() => setCardIndex(c => c - 1)} style={{ flex: 1, padding: "14px", borderRadius: 12, border: "1.5px solid #333333", background: "transparent", color: "#F5F5F5", fontWeight: 600, fontSize: 15, cursor: "pointer" }}>← Back</button>
            )}
            <button onClick={() => {
              if (cardIndex < INTRO_CARDS.length - 1) setCardIndex(c => c + 1);
              else setStep(5);
            }} style={{
              flex: 1, padding: "14px", borderRadius: 12, border: "none",
              background: "linear-gradient(135deg, #1AEF22, #06B517)",
              color: "#000", fontWeight: 800, fontSize: 15, cursor: "pointer",
            }}>
              {cardIndex < INTRO_CARDS.length - 1 ? "Next →" : "Got it, take me to tasks →"}
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 5: Guided Overlay ── */}
      {step === 5 && (
        <div style={{ maxWidth: 420, width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, #1AEF22, #06B517)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 28 }}>
              🎉
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#F5F5F5", marginBottom: 8 }}>You&apos;re all set, {firstName}!</h2>
            <p style={{ fontSize: 14, color: "#888888" }}>Here&apos;s a quick guide to get you started.</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
            {HIGHLIGHTS.map((h, i) => (
              <div key={i} style={{ background: "#111111", borderRadius: 16, padding: "16px 18px", border: "1px solid #222222", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(26,239,34,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Image src={h.icon} alt={h.label} width={24} height={24} style={{ objectFit: "contain" }} />
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#F5F5F5" }}>{h.label}</p>
                  <p style={{ fontSize: 12, color: "#888888", marginTop: 2 }}>{h.hint}</p>
                </div>
                <div style={{ marginLeft: "auto", background: "rgba(26,239,34,0.1)", borderRadius: 8, padding: "4px 10px" }}>
                  <span style={{ fontSize: 11, color: "#1AEF22", fontWeight: 700 }}>→</span>
                </div>
              </div>
            ))}
          </div>

          {/* Trust reinforcement */}
          <div style={{ background: "#0a0a0a", borderRadius: 14, padding: "14px 16px", border: "1px solid #222222", marginBottom: 20 }}>
            {[
              "All tasks are verified before listing",
              "Your earnings are tracked transparently",
              "Conversion rate is fixed: 100 QLT = ₦1",
            ].map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: i < 2 ? 8 : 0 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#1AEF22", flexShrink: 0 }} />
                <p style={{ fontSize: 12, color: "#b0b0b0" }}>{t}</p>
              </div>
            ))}
          </div>

          <button onClick={handleDone} style={{
            width: "100%", background: "linear-gradient(135deg, #F5A623, #d89420)",
            color: "#000", border: "none", borderRadius: 14, padding: "16px",
            fontWeight: 800, fontSize: 16, cursor: "pointer",
            boxShadow: "0 6px 20px rgba(245,166,35,0.35)",
          }}>
            Take me to tasks →
          </button>
        </div>
      )}
    </div>
  );
}

function StepHeader({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: i < current ? "#1AEF22" : "#222222", transition: "background 0.3s" }} />
      ))}
      <span style={{ fontSize: 12, color: "#555555", flexShrink: 0 }}>{current}/{total}</span>
    </div>
  );
}
