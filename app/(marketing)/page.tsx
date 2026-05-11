"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const missionTypes = [
  {
    icon: "/icon-social-media.jpg", type: "Engagement", color: "rgba(74,158,255,0.1)", badge: "#4a9eff",
    title: "Social & Community Actions",
    desc: "Follow, join, engage. Simple actions that build real audience presence for brands.",
    examples: ["Follow on Instagram", "Join Telegram group", "Like & comment on post"],
    reward: "10k–15k QLT",
  },
  {
    icon: "/icon-survey.png", type: "Participation", color: "rgba(245,166,35,0.1)", badge: "#F5A623",
    title: "Surveys & Feedback Missions",
    desc: "Share your opinions on products, services, and ideas. Your insight has real market value.",
    examples: ["Answer 5-question survey", "Rate product experience", "Vote on design options"],
    reward: "35k–50k QLT",
  },
  {
    icon: "/icon-app-testing.png", type: "Premium", color: "rgba(192,132,252,0.1)", badge: "#c084fc",
    title: "Testing & Validation Tasks",
    desc: "Test apps, report bugs, validate UX. Businesses pay premium for structured human feedback.",
    examples: ["Test mobile app & report 3 issues", "Complete onboarding flow", "Validate checkout process"],
    reward: "80k–120k QLT",
  },
  {
    icon: "/icon-content.png", type: "AI Testing", color: "rgba(26,239,34,0.1)", badge: "#1AEF22",
    title: "AI & Content Evaluation",
    desc: "Evaluate AI responses, watch content, and provide structured feedback that trains better systems.",
    examples: ["Rate AI response quality", "Watch video & summarize", "Compare two AI outputs"],
    reward: "18k–25k QLT",
  },
];

const levels = [
  { num: 1, name: "Starter",   color: "#888888", xp: "0 XP",     cap: "₦50/day",   unlock: "Engagement missions" },
  { num: 2, name: "Explorer",  color: "#4a9eff", xp: "500 XP",   cap: "₦150/day",  unlock: "+ Participation missions" },
  { num: 3, name: "Achiever",  color: "#1AEF22", xp: "1,500 XP", cap: "₦350/day",  unlock: "+ Premium missions" },
  { num: 4, name: "Expert",    color: "#F5A623", xp: "4,000 XP", cap: "₦750/day",  unlock: "+ Leaderboard bonuses" },
  { num: 5, name: "Elite",     color: "#e53e3e", xp: "10,000 XP",cap: "₦1,500/day",unlock: "+ UGC missions" },
];

const steps = [
  { num: "01", title: "Create Your Account",    desc: "Sign up free. No experience needed. Access missions immediately." },
  { num: "02", title: "Pick a Mission",         desc: "Choose from engagement, participation, or premium missions based on your level." },
  { num: "03", title: "Complete & Submit Proof",desc: "Follow the steps, submit your proof. Every approved mission earns QLT + XP." },
  { num: "04", title: "Level Up & Earn More",   desc: "XP unlocks higher-value missions and bigger daily earning caps." },
];

const faqs = [
  { q: "What is Qeixova?", a: "Qeixova is a human participation marketplace. Businesses post structured missions — surveys, app tests, community actions, content feedback — and verified users complete them for QLT rewards." },
  { q: "What are QLT Points?", a: "QLT (Qeixova Loyalty Token) is the reward currency. 100 QLT = ₦1. Every approved mission credits QLT to your balance. Withdraw anytime to your bank account." },
  { q: "How is this different from other earn apps?", a: "We don't pay for fake engagement. Every mission has a purpose — real feedback, real testing, real participation. Businesses pay for verified human interaction, not bot clicks." },
  { q: "What is the level system?", a: "You earn XP with every approved mission. Higher levels unlock premium missions with bigger rewards and higher daily earning caps — up to ₦1,500/day at Elite level." },
  { q: "How do withdrawals work?", a: "Go to Wallet, enter the amount, select your bank account, and tap Withdraw. Minimum is 100,000 QLT (₦1,000). Processed within 24 hours." },
  { q: "Is it free to join?", a: "Yes, completely free. No registration fee, no deposits, no hidden charges. You can optionally use a referral code during signup for a welcome bonus." },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ background: "#000000", color: "#F5F5F5", overflowX: "hidden" }}>

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(0,0,0,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #1a1a1a", padding: "0 5vw", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Image src="/qeixova-icon.png" alt="Qeixova" width={36} height={36} style={{ borderRadius: 10, objectFit: "contain" }} />
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: -0.5 }}>Qeixova</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Link href="/login" style={{ fontSize: 13, fontWeight: 600, color: "#1AEF22", textDecoration: "none", padding: "8px 14px" }}>Log in</Link>
          <Link href="/business/login" style={{ fontSize: 13, fontWeight: 600, color: "#888", textDecoration: "none", padding: "8px 14px" }}>Business</Link>
          <Link href="/register" style={{ fontSize: 13, fontWeight: 700, color: "#000", textDecoration: "none", padding: "9px 18px", background: "linear-gradient(135deg, #1AEF22, #06B517)", borderRadius: 10, boxShadow: "0 4px 14px rgba(26,239,34,0.3)" }}>Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: "linear-gradient(160deg, #050505 0%, #0d0d0d 100%)", padding: "90px 5vw 100px", position: "relative", overflow: "hidden", textAlign: "center", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(26,239,34,0.04) 0%, transparent 70%)" }} />
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(26,239,34,0.08)", border: "1px solid rgba(26,239,34,0.2)", borderRadius: 20, padding: "6px 16px", marginBottom: 28 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#1AEF22", boxShadow: "0 0 8px #1AEF22" }} />
          <span style={{ fontSize: 12, color: "#1AEF22", fontWeight: 700, letterSpacing: 0.5 }}>Human Participation Marketplace</span>
        </div>
        <h1 style={{ fontSize: "clamp(32px, 6vw, 68px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: -2, maxWidth: 820, margin: "0 auto 20px", color: "#F5F5F5" }}>
          Your participation<br />
          <span style={{ background: "linear-gradient(135deg, #1AEF22, #06B517)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>has real value.</span>
        </h1>
        <p style={{ fontSize: "clamp(15px, 2vw, 19px)", color: "#888", maxWidth: 560, margin: "0 auto 16px", lineHeight: 1.7 }}>
          Complete structured missions — surveys, app testing, community actions, AI evaluation — and earn <strong style={{ color: "#F5A623" }}>QLT</strong> that converts to real Naira.
        </p>
        <div style={{ display: "inline-flex", gap: 20, background: "#0d0d0d", border: "1px solid #222", borderRadius: 14, padding: "12px 24px", marginBottom: 36, flexWrap: "wrap", justifyContent: "center" }}>
          <span style={{ fontSize: 13, color: "#F5A623", fontWeight: 700 }}>100 QLT = ₦1</span>
          <span style={{ color: "#333" }}>|</span>
          <span style={{ fontSize: 13, color: "#888" }}>5 levels · daily earning caps</span>
          <span style={{ color: "#333" }}>|</span>
          <span style={{ fontSize: 13, color: "#888" }}>XP-based progression</span>
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/register" style={{ background: "linear-gradient(135deg, #F5A623, #d89420)", color: "#000", textDecoration: "none", padding: "16px 36px", borderRadius: 14, fontWeight: 800, fontSize: 16, boxShadow: "0 8px 28px rgba(245,166,35,0.4)" }}>
            Start Earning Free
          </Link>
          <a href="#how-it-works" style={{ background: "#111", border: "1.5px solid #222", color: "#F5F5F5", textDecoration: "none", padding: "16px 28px", borderRadius: 14, fontWeight: 600, fontSize: 15 }}>
            See How It Works
          </a>
        </div>
        <p style={{ color: "#444", fontSize: 12, marginTop: 16 }}>Free to join. No experience needed. Withdraw to any Nigerian bank.</p>
      </section>

      {/* Trust strip */}
      <section style={{ background: "#0a0a0a", borderBottom: "1px solid #1a1a1a", padding: "18px 5vw" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 32, flexWrap: "wrap" }}>
          {["Verified missions only", "Pay-per-completion model", "XP-based level system", "Transparent QLT conversion", "24h withdrawal processing"].map(t => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#1AEF22", flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: "#888", fontWeight: 500 }}>{t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Mission Types */}
      <section style={{ padding: "80px 5vw", background: "#000" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#1AEF22", letterSpacing: 2, textTransform: "uppercase", background: "rgba(26,239,34,0.08)", borderRadius: 20, padding: "4px 14px" }}>Mission Types</span>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 900, color: "#F5F5F5", marginTop: 14, letterSpacing: -1 }}>Four mission categories. One platform.</h2>
            <p style={{ fontSize: 15, color: "#666", maxWidth: 500, margin: "12px auto 0", lineHeight: 1.7 }}>Each mission type serves a real business need. You get paid for verified human interaction — not clicks.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {missionTypes.map(m => (
              <div key={m.type} style={{ background: "#0d0d0d", borderRadius: 20, padding: "26px 22px", border: "1px solid #1a1a1a", borderTop: `3px solid ${m.badge}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: m.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Image src={m.icon} alt={m.type} width={26} height={26} style={{ objectFit: "contain" }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: m.badge, background: m.color, borderRadius: 8, padding: "3px 10px" }}>{m.type}</span>
                </div>
                <h3 style={{ fontWeight: 800, fontSize: 15, color: "#F5F5F5", marginBottom: 8, lineHeight: 1.3 }}>{m.title}</h3>
                <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, marginBottom: 14 }}>{m.desc}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 14 }}>
                  {m.examples.map(ex => (
                    <div key={ex} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <span style={{ color: m.badge, fontSize: 11 }}>→</span>
                      <span style={{ fontSize: 12, color: "#888" }}>{ex}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: m.color, borderRadius: 8, padding: "6px 12px", display: "inline-block" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: m.badge }}>{m.reward} per mission</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{ padding: "80px 5vw", background: "#050505", borderTop: "1px solid #1a1a1a" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#1AEF22", letterSpacing: 2, textTransform: "uppercase", background: "rgba(26,239,34,0.08)", borderRadius: 20, padding: "4px 14px" }}>Simple Process</span>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 900, color: "#F5F5F5", marginTop: 14, letterSpacing: -1 }}>How Qeixova Works</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 32 }}>
            {steps.map(s => (
              <div key={s.num} style={{ textAlign: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#0d0d0d", border: "2px solid #1AEF22", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: "0 4px 16px rgba(26,239,34,0.15)" }}>
                  <span style={{ fontSize: 22, fontWeight: 900, color: "#F5F5F5" }}>{s.num}</span>
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 15, color: "#F5F5F5", marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Levels system */}
      <section style={{ padding: "80px 5vw", background: "#000" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#F5A623", letterSpacing: 2, textTransform: "uppercase", background: "rgba(245,166,35,0.08)", borderRadius: 20, padding: "4px 14px" }}>Level System</span>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 900, color: "#F5F5F5", marginTop: 14, letterSpacing: -1 }}>The more you do, the more you earn.</h2>
            <p style={{ fontSize: 15, color: "#666", maxWidth: 480, margin: "12px auto 0", lineHeight: 1.7 }}>Complete missions to earn XP. XP unlocks higher-value missions and bigger daily earning caps.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {levels.map((l, i) => (
              <div key={l.num} style={{ background: "#0d0d0d", borderRadius: 14, padding: "16px 20px", border: "1px solid #1a1a1a", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: l.color + "22", border: `2px solid ${l.color}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: l.color }}>{l.num}</span>
                </div>
                <div style={{ flex: 1, minWidth: 120 }}>
                  <p style={{ fontSize: 15, fontWeight: 800, color: l.color, marginBottom: 2 }}>{l.name}</p>
                  <p style={{ fontSize: 12, color: "#555" }}>{l.unlock}</p>
                </div>
                <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>Required</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#F5A623" }}>{l.xp}</p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>Daily Cap</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#1AEF22" }}>{l.cap}</p>
                  </div>
                </div>
                {i === 0 && <span style={{ fontSize: 11, fontWeight: 700, color: "#1AEF22", background: "rgba(26,239,34,0.1)", borderRadius: 8, padding: "3px 10px" }}>Start here</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Businesses */}
      <section id="for-businesses" style={{ padding: "80px 5vw", background: "#050505", borderTop: "1px solid #1a1a1a" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#F5A623", letterSpacing: 2, textTransform: "uppercase", background: "rgba(245,166,35,0.08)", borderRadius: 20, padding: "4px 14px" }}>For Businesses</span>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 900, color: "#F5F5F5", marginTop: 14, letterSpacing: -1 }}>Buy human validation. Not impressions.</h2>
            <p style={{ fontSize: 15, color: "#666", maxWidth: 520, margin: "12px auto 0", lineHeight: 1.7 }}>
              Ads buy attention. Qeixova buys verified human interaction — opinions, actions, feedback, and proof of participation.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 40 }}>
            {[
              { icon: "📋", title: "Create a Mission", desc: "Define what you need. Set reward per completion. Submit for review.", color: "rgba(245,166,35,0.08)" },
              { icon: "🎯", title: "Target Your Audience", desc: "Filter by age, gender, state, interests, and platforms.", color: "rgba(26,239,34,0.08)" },
              { icon: "✅", title: "Get Verified Results", desc: "Every submission is reviewed. Pay only for approved completions.", color: "rgba(245,166,35,0.08)" },
              { icon: "📊", title: "Track in Real Time", desc: "Monitor submissions, approvals, and campaign progress live.", color: "rgba(26,239,34,0.08)" },
            ].map(item => (
              <div key={item.title} style={{ background: "#0d0d0d", borderRadius: 18, padding: "24px 20px", border: "1px solid #1a1a1a" }}>
                <div style={{ width: 48, height: 48, borderRadius: 13, background: item.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 14 }}>{item.icon}</div>
                <h3 style={{ fontWeight: 800, fontSize: 14, color: "#F5F5F5", marginBottom: 6 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ background: "linear-gradient(135deg, #0d0d0d, #111)", border: "1px solid rgba(245,166,35,0.2)", borderRadius: 20, padding: "32px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
            <div>
              <p style={{ fontSize: 18, fontWeight: 800, color: "#F5F5F5", marginBottom: 8 }}>Ready to launch your first campaign?</p>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {["Pay per completion", "Verified users only", "Full audience targeting"].map(t => (
                  <span key={t} style={{ fontSize: 12, color: "#888" }}><span style={{ color: "#F5A623" }}>✓</span> {t}</span>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Link href="/business/register" style={{ background: "linear-gradient(135deg, #F5A623, #d89420)", color: "#000", textDecoration: "none", padding: "12px 24px", borderRadius: 11, fontWeight: 800, fontSize: 14, boxShadow: "0 6px 20px rgba(245,166,35,0.3)", whiteSpace: "nowrap" }}>
                Start Free →
              </Link>
              <Link href="/business/login" style={{ background: "transparent", border: "1.5px solid #333", color: "#888", textDecoration: "none", padding: "12px 20px", borderRadius: 11, fontWeight: 600, fontSize: 13, whiteSpace: "nowrap" }}>
                Business Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "80px 5vw", background: "#000" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#1AEF22", letterSpacing: 2, textTransform: "uppercase", background: "rgba(26,239,34,0.08)", borderRadius: 20, padding: "4px 14px" }}>FAQ</span>
            <h2 style={{ fontSize: "clamp(22px, 4vw, 36px)", fontWeight: 900, color: "#F5F5F5", marginTop: 14, letterSpacing: -1 }}>Common questions</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ background: openFaq === i ? "#0d0d0d" : "#050505", border: `1.5px solid ${openFaq === i ? "rgba(26,239,34,0.25)" : "#1a1a1a"}`, borderRadius: 14, overflow: "hidden" }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: "100%", padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: "#F5F5F5" }}>{faq.q}</span>
                  <span style={{ width: 26, height: 26, borderRadius: 7, background: openFaq === i ? "#1AEF22" : "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", color: openFaq === i ? "#000" : "#888", fontSize: 16, fontWeight: 700, flexShrink: 0 }}>
                    {openFaq === i ? "−" : "+"}
                  </span>
                </button>
                {openFaq === i && <p style={{ padding: "0 18px 16px", fontSize: 13, color: "#888", lineHeight: 1.7 }}>{faq.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ background: "#050505", borderTop: "1px solid #1a1a1a", padding: "80px 5vw", textAlign: "center" }}>
        <div style={{ position: "relative", display: "inline-block", marginBottom: 20 }}>
          <Image src="/qeixova-logo.png" alt="Qeixova" width={64} height={64} style={{ objectFit: "contain", borderRadius: 18 }} />
        </div>
        <h2 style={{ fontSize: "clamp(24px, 5vw, 48px)", fontWeight: 900, color: "#F5F5F5", letterSpacing: -1.5, marginBottom: 14 }}>
          Your participation has value.<br />
          <span style={{ background: "linear-gradient(135deg, #1AEF22, #06B517)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Start earning it.</span>
        </h2>
        <p style={{ color: "#666", fontSize: 15, maxWidth: 420, margin: "0 auto 36px", lineHeight: 1.7 }}>
          Join users already completing missions and converting QLT to real Naira daily.
        </p>
        <Link href="/register" style={{ background: "linear-gradient(135deg, #F5A623, #d89420)", color: "#000", textDecoration: "none", padding: "18px 44px", borderRadius: 14, fontWeight: 800, fontSize: 17, boxShadow: "0 8px 28px rgba(245,166,35,0.4)", display: "inline-block" }}>
          Start Earning Free
        </Link>
        <p style={{ color: "#333", fontSize: 12, marginTop: 14 }}>Free forever. No experience needed. Withdraw to any Nigerian bank.</p>
      </section>

      {/* Footer */}
      <footer style={{ background: "#000", borderTop: "1px solid #111", padding: "52px 5vw 28px", color: "#555" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 36, marginBottom: 44 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <Image src="/qeixova-icon.png" alt="Qeixova" width={32} height={32} style={{ borderRadius: 9, objectFit: "contain" }} />
                <span style={{ fontWeight: 800, fontSize: 16, color: "#F5F5F5" }}>Qeixova</span>
              </div>
              <p style={{ fontSize: 12, lineHeight: 1.8, color: "#444", maxWidth: 200 }}>Human participation marketplace. Earn by doing real things.</p>
              <div style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.15)", borderRadius: 8, padding: "5px 10px" }}>
                <span style={{ fontSize: 11, color: "#F5A623", fontWeight: 700 }}>100 QLT = ₦1</span>
              </div>
            </div>
            <div>
              <p style={{ color: "#F5F5F5", fontWeight: 700, fontSize: 12, marginBottom: 14, letterSpacing: 0.3 }}>Platform</p>
              {[{ label: "How it works", href: "#how-it-works" }, { label: "Mission types", href: "#" }, { label: "Level system", href: "#" }, { label: "For businesses", href: "#for-businesses" }].map(l => (
                <a key={l.label} href={l.href} style={{ display: "block", fontSize: 12, marginBottom: 9, color: "#444", textDecoration: "none" }}>{l.label}</a>
              ))}
            </div>
            <div>
              <p style={{ color: "#F5F5F5", fontWeight: 700, fontSize: 12, marginBottom: 14, letterSpacing: 0.3 }}>Support</p>
              {[{ label: "Help center", href: "#" }, { label: "Contact", href: "mailto:qeixova@gmail.com" }, { label: "Privacy policy", href: "#" }, { label: "Terms", href: "#" }].map(l => (
                <a key={l.label} href={l.href} style={{ display: "block", fontSize: 12, marginBottom: 9, color: "#444", textDecoration: "none" }}>{l.label}</a>
              ))}
            </div>
            <div>
              <p style={{ color: "#F5F5F5", fontWeight: 700, fontSize: 12, marginBottom: 14, letterSpacing: 0.3 }}>Social</p>
              <a href="https://x.com/QeixovaTech" target="_blank" rel="noopener noreferrer" style={{ display: "block", fontSize: 12, marginBottom: 9, color: "#444", textDecoration: "none" }}>@QeixovaTech</a>
              <a href="https://www.facebook.com/profile.php?id=61568026449468" target="_blank" rel="noopener noreferrer" style={{ display: "block", fontSize: 12, marginBottom: 9, color: "#444", textDecoration: "none" }}>Facebook</a>
              <a href="mailto:qeixova@gmail.com" style={{ display: "block", fontSize: 12, color: "#444", textDecoration: "none" }}>qeixova@gmail.com</a>
            </div>
          </div>
          <div style={{ borderTop: "1px solid #111", paddingTop: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <p style={{ fontSize: 11, color: "#333" }}>© 2026 Qeixova. All rights reserved.</p>
            <p style={{ fontSize: 11, color: "#333" }}>Human participation marketplace. Built for real earners.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
