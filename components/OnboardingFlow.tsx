"use client";
import { useState } from "react";
import Image from "next/image";

interface Props {
  userName: string;
  onComplete: () => void;
}

const INTRO_CARDS = [
  {
    icon: "/icon-task.png",
    title: "Complete Tasks",
    body: "Choose from social actions, surveys, app testing, and AI evaluations.",
  },
  {
    icon: "/icon-wallet.png",
    title: "Earn QLT",
    body: "Each completed and approved task earns you QLT points instantly.",
  },
  {
    icon: "/icon-wallet.png",
    title: "Convert to Naira",
    body: "100 QLT = ₦1. Track and convert your earnings anytime from your wallet.",
  },
];

export default function OnboardingFlow({ userName, onComplete }: Props) {
  const [step, setStep] = useState(0); // 0=welcome, 1=intro cards, 2=bank setup, 3=done
  const [cardIndex, setCardIndex] = useState(0);
  const [bank, setBank] = useState({ bank_name: "", account_number: "", account_name: "" });
  const [saving, setSaving] = useState(false);

  const firstName = userName?.split(" ")[0] ?? "there";

  const handleFinish = async () => {
    setSaving(true);
    await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bank),
    });
    setSaving(false);
    onComplete();
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#000000",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }}>
      {/* Step 0 — Welcome */}
      {step === 0 && (
        <div style={{ textAlign: "center", maxWidth: 400, width: "100%" }}>
          <img src="/qeixova-icon.png" alt="Qeixova" style={{ width: 72, height: 72, borderRadius: 20, objectFit: "contain", boxShadow: "0 8px 24px rgba(26,239,34,0.4)", marginBottom: 24 }} />
          <h1 style={{ fontSize: 28, fontWeight: 900, color: "#F5F5F5", letterSpacing: -1, marginBottom: 12 }}>
            Welcome, {firstName}!
          </h1>
          <p style={{ fontSize: 15, color: "#b0b0b0", lineHeight: 1.7, marginBottom: 32 }}>
            You&apos;re now ready to start completing tasks and earning QLT. Let&apos;s get you set up in 3 quick steps.
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

      {/* Step 1 — Intro Cards */}
      {step === 1 && (
        <div style={{ maxWidth: 400, width: "100%" }}>
          {/* Progress dots */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 32 }}>
            {INTRO_CARDS.map((_, i) => (
              <div key={i} style={{ width: i === cardIndex ? 24 : 8, height: 8, borderRadius: 4, background: i === cardIndex ? "#1AEF22" : "#333333", transition: "all 0.3s" }} />
            ))}
          </div>

          <div style={{ background: "#111111", borderRadius: 24, padding: "40px 32px", border: "1px solid #222222", textAlign: "center", minHeight: 280 }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: "rgba(26,239,34,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <Image src={INTRO_CARDS[cardIndex].icon} alt="" width={36} height={36} style={{ objectFit: "contain" }} />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#F5F5F5", marginBottom: 12 }}>
              {INTRO_CARDS[cardIndex].title}
            </h2>
            <p style={{ fontSize: 15, color: "#b0b0b0", lineHeight: 1.7 }}>
              {INTRO_CARDS[cardIndex].body}
            </p>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
            {cardIndex > 0 && (
              <button onClick={() => setCardIndex(c => c - 1)} style={{ flex: 1, padding: "14px", borderRadius: 12, border: "1.5px solid #333333", background: "transparent", color: "#F5F5F5", fontWeight: 600, fontSize: 15, cursor: "pointer" }}>
                ← Back
              </button>
            )}
            <button onClick={() => {
              if (cardIndex < INTRO_CARDS.length - 1) setCardIndex(c => c + 1);
              else setStep(2);
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

      {/* Step 2 — Bank Setup */}
      {step === 2 && (
        <div style={{ maxWidth: 420, width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(245,166,35,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Image src="/icon-wallet.png" alt="wallet" width={32} height={32} style={{ objectFit: "contain" }} />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#F5F5F5", marginBottom: 8 }}>Set Up Your Earnings</h2>
            <p style={{ fontSize: 14, color: "#b0b0b0", lineHeight: 1.6 }}>
              Add your bank account so your earnings can be converted when needed.
            </p>
          </div>

          <div style={{ background: "#111111", borderRadius: 20, padding: "24px 20px", border: "1px solid #222222", display: "flex", flexDirection: "column", gap: 14 }}>
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
                  style={{ width: "100%", marginTop: 6, padding: "13px 14px", borderRadius: 12, border: "1.5px solid #333333", fontSize: 14, outline: "none", color: "#F5F5F5", background: "#1a1a1a" }}
                  onFocus={e => (e.target.style.borderColor = "#1AEF22")}
                  onBlur={e => (e.target.style.borderColor = "#333333")}
                />
              </div>
            ))}
          </div>

          <p style={{ fontSize: 12, color: "#555555", textAlign: "center", marginTop: 12 }}>
            You can update this anytime in your Profile → Bank Accounts
          </p>

          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            <button onClick={handleFinish} style={{
              flex: 1, padding: "15px", borderRadius: 12, border: "1.5px solid #333333",
              background: "transparent", color: "#999999", fontWeight: 600, fontSize: 14, cursor: "pointer",
            }}>
              Skip for now
            </button>
            <button onClick={handleFinish} disabled={saving} style={{
              flex: 2, padding: "15px", borderRadius: 12, border: "none",
              background: "linear-gradient(135deg, #F5A623, #d89420)",
              color: "#000", fontWeight: 800, fontSize: 15, cursor: "pointer",
              boxShadow: "0 6px 20px rgba(245,166,35,0.35)",
            }}>
              {saving ? "Saving..." : "Save & Continue →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
