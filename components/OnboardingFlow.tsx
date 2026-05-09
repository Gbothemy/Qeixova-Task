"use client";
import { useState } from "react";
import Image from "next/image";
import TutorialFlow from "@/components/TutorialFlow";

interface Props {
  userName: string;
  onComplete: () => void;
}

const PROFESSIONS = [
  "Student", "Employed (Full-time)", "Employed (Part-time)", "Self-employed / Freelancer",
  "Business Owner", "Job Seeker", "Stay-at-home Parent", "Creative (Designer/Writer/Artist)",
  "Tech Professional", "Healthcare Worker", "Educator / Teacher",
  "Finance / Banking", "Government / Civil Service", "Other",
];

const INTERESTS = [
  "Technology & Gadgets", "Fashion & Beauty", "Food & Restaurants",
  "Finance & Investment", "Gaming", "Health & Fitness", "Travel",
  "Entertainment & Movies", "Sports", "Education & Learning",
  "Real Estate", "Business & Entrepreneurship", "Parenting & Family", "Politics & News",
];

const PLATFORMS = ["Instagram", "TikTok", "X (Twitter)", "YouTube", "Facebook", "LinkedIn", "WhatsApp"];

const AGE_RANGES = ["18–24", "25–34", "35–44", "45+"];

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT (Abuja)", "Gombe",
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara",
  "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau",
  "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

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
  // Steps: 0=welcome, 1=profile, 2=bank, 3=targeting, 4=referral, 5=intro cards
  const [step, setStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);
  const [profile, setProfile] = useState({ username: "", country: "Nigeria" });
  const [bank, setBank] = useState({ bank_name: "", account_number: "", account_name: "" });
  const [targeting, setTargeting] = useState({
    profession: "",
    interests: [] as string[],
    platforms: [] as string[],
    age_range: "",
    gender: "",
    state: "",
  });
  const [referralCode, setReferralCode] = useState("");
  const [saving, setSaving] = useState(false);

  const firstName = userName?.split(" ")[0] ?? "there";

  const handleFinish = async () => {
    setSaving(true);
    await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...bank, ...targeting, referralCode }),
    });
    setSaving(false);
    setShowTutorial(true);
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
      padding: 24,
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
          <StepHeader current={2} total={4} />
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

      {/* ── STEP 3: Targeting Profile ── */}
      {step === 3 && (
        <div style={{ maxWidth: 440, width: "100%", position: "absolute", inset: 0, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: "100%", maxWidth: 440, paddingBottom: 40 }}>
          <StepHeader current={3} total={4} />
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#F5F5F5", marginBottom: 6 }}>Your Profile</h2>
          <p style={{ fontSize: 13, color: "#888888", marginBottom: 20 }}>Helps us show you tasks that match your background. Takes 30 seconds.</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Profession */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#666666", letterSpacing: 0.5 }}>PROFESSION</label>
              <select value={targeting.profession} onChange={e => setTargeting(t => ({ ...t, profession: e.target.value }))}
                style={{ ...inputStyle, marginTop: 8, cursor: "pointer" }}>
                <option value="">Select your profession</option>
                {PROFESSIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            {/* Age Range */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#666666", letterSpacing: 0.5 }}>AGE RANGE</label>
              <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                {AGE_RANGES.map(a => (
                  <button key={a} type="button" onClick={() => setTargeting(t => ({ ...t, age_range: a }))}
                    style={{ padding: "8px 16px", borderRadius: 20, border: `1.5px solid ${targeting.age_range === a ? "#1AEF22" : "#333333"}`, background: targeting.age_range === a ? "rgba(26,239,34,0.1)" : "transparent", color: targeting.age_range === a ? "#1AEF22" : "#888888", fontSize: 13, cursor: "pointer", fontWeight: targeting.age_range === a ? 700 : 400 }}>
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Gender */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#666666", letterSpacing: 0.5 }}>GENDER</label>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                {["Male", "Female", "Prefer not to say"].map(g => (
                  <button key={g} type="button" onClick={() => setTargeting(t => ({ ...t, gender: g }))}
                    style={{ flex: 1, padding: "8px 12px", borderRadius: 20, border: `1.5px solid ${targeting.gender === g ? "#1AEF22" : "#333333"}`, background: targeting.gender === g ? "rgba(26,239,34,0.1)" : "transparent", color: targeting.gender === g ? "#1AEF22" : "#888888", fontSize: 12, cursor: "pointer", fontWeight: targeting.gender === g ? 700 : 400 }}>
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* State */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#666666", letterSpacing: 0.5 }}>STATE</label>
              <select value={targeting.state} onChange={e => setTargeting(t => ({ ...t, state: e.target.value }))}
                style={{ ...inputStyle, marginTop: 8, cursor: "pointer" }}>
                <option value="">Select your state</option>
                {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Interests */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#666666", letterSpacing: 0.5 }}>INTERESTS (select all that apply)</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                {INTERESTS.map(interest => {
                  const selected = targeting.interests.includes(interest);
                  return (
                    <button key={interest} type="button" onClick={() => setTargeting(t => ({
                      ...t,
                      interests: selected ? t.interests.filter(i => i !== interest) : [...t.interests, interest]
                    }))}
                      style={{ padding: "7px 14px", borderRadius: 20, border: `1.5px solid ${selected ? "#1AEF22" : "#333333"}`, background: selected ? "rgba(26,239,34,0.1)" : "transparent", color: selected ? "#1AEF22" : "#888888", fontSize: 12, cursor: "pointer", fontWeight: selected ? 700 : 400 }}>
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Platforms */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#666666", letterSpacing: 0.5 }}>PLATFORMS YOU USE</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                {PLATFORMS.map(platform => {
                  const selected = targeting.platforms.includes(platform);
                  return (
                    <button key={platform} type="button" onClick={() => setTargeting(t => ({
                      ...t,
                      platforms: selected ? t.platforms.filter(p => p !== platform) : [...t.platforms, platform]
                    }))}
                      style={{ padding: "7px 14px", borderRadius: 20, border: `1.5px solid ${selected ? "#F5A623" : "#333333"}`, background: selected ? "rgba(245,166,35,0.1)" : "transparent", color: selected ? "#F5A623" : "#888888", fontSize: 12, cursor: "pointer", fontWeight: selected ? 700 : 400 }}>
                      {platform}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button onClick={() => setStep(2)} style={{ flex: 1, padding: "14px", borderRadius: 12, border: "1.5px solid #333333", background: "transparent", color: "#888888", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>← Back</button>
            <button onClick={() => setStep(4)} style={{ flex: 2, padding: "14px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #1AEF22, #06B517)", color: "#000", fontWeight: 800, fontSize: 15, cursor: "pointer" }}>
              Continue →
            </button>
          </div>
          <button onClick={() => setStep(4)} style={{ width: "100%", marginTop: 10, padding: "10px", borderRadius: 12, border: "none", background: "transparent", color: "#555555", fontSize: 12, cursor: "pointer" }}>
            Skip for now
          </button>
        </div>
        </div>
      )}

      {/* ── STEP 4: Optional Referral ── */}
      {step === 4 && (
        <div style={{ maxWidth: 420, width: "100%" }}>
          <StepHeader current={4} total={4} />
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
            <button onClick={() => setStep(3)} style={{ flex: 1, padding: "14px", borderRadius: 12, border: "1.5px solid #333333", background: "transparent", color: "#888888", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>← Back</button>
            <button onClick={handleFinish} disabled={saving} style={{ flex: 2, padding: "14px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #F5A623, #d89420)", color: "#000", fontWeight: 800, fontSize: 15, cursor: "pointer", boxShadow: "0 6px 20px rgba(245,166,35,0.35)" }}>
              {saving ? "Saving..." : "Finish Setup →"}
            </button>
          </div>
          <button onClick={handleFinish} disabled={saving} style={{ width: "100%", marginTop: 12, padding: "12px", borderRadius: 12, border: "none", background: "transparent", color: "#555555", fontSize: 13, cursor: "pointer" }}>
            Skip for now
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
