"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const features = [
  { icon: "/icon-social-media.jpg", title: "Social Media Tasks",   desc: "Complete social actions like follows, likes, shares, and engagement across Instagram, TikTok, X, and more.", color: "rgba(26,239,34,0.1)" },
  { icon: "/icon-survey.png",       title: "Surveys & Polls",      desc: "Share your opinion on products, services, and lifestyle topics. Your feedback has real value.",               color: "rgba(245,166,35,0.1)" },
  { icon: "/icon-app-testing.png",  title: "App Testing",          desc: "Test new mobile apps and websites before they launch. Your feedback directly shapes real products.",          color: "rgba(26,239,34,0.1)" },
  { icon: "/icon-content.png",      title: "AI & Content Tasks",   desc: "Evaluate AI responses, watch videos, read articles, and interact with digital content to earn rewards.",      color: "rgba(245,166,35,0.1)" },
];

const steps = [
  { num: "01", icon: "1", title: "Create Your Account",   desc: "Sign up in seconds and access available tasks immediately. No experience needed." },
  { num: "02", icon: "2", title: "Browse & Pick Tasks",   desc: "Choose from social tasks, surveys, app testing, and AI evaluations. Each task is simple and guided." },
  { num: "03", icon: "3", title: "Complete & Submit",     desc: "Follow the task steps and submit proof of completion. Every completed task credits QLT instantly." },
  { num: "04", icon: "4", title: "Convert & Withdraw",    desc: "Convert your QLT to Naira anytime. Cash out directly to your bank or mobile wallet." },
];

const trustItems = [
  "Transparent reward system",
  "Simple, guided tasks",
  "Fast completion process",
  "Built for real users",
];

const faqs = [
  { q: "What are QLT Points?", a: "QLT (Qeixova Loyalty Token) is the reward currency on Qeixova Tasks. Every task you complete earns you QLT. 100 QLT = ₦1. You can convert and withdraw anytime with no hidden conditions." },
  { q: "Is Qeixova Tasks free to join?", a: "Yes, completely free. No registration fee, no hidden charges, no deposits. You can optionally enter a referral code during setup to earn bonus QLT." },
  { q: "How do I convert points to cash?", a: "Go to your Wallet, enter the amount of QLT you want to convert, select your bank account and tap Withdraw. Minimum withdrawal is 100,000 QLT (₦1,000)." },
  { q: "How quickly are withdrawals processed?", a: "Withdrawals are processed within 24 hours to your bank account or mobile wallet (Opay, Palmpay, GTBank, etc.)." },
  { q: "How many tasks can I do per day?", a: "There is no daily limit. New tasks are added regularly so there is always something to earn from." },
  { q: "Are the tasks verified?", a: "Yes. All tasks are verified before listing. Your earnings are tracked transparently and the conversion rate is fixed at 100 QLT = ₦1." },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ background: "#000000", color: "#F5F5F5", overflowX: "hidden" }}>

      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(0,0,0,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #222222", padding: "0 5vw", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/qeixova-icon.png" alt="Qeixova" style={{ width: 36, height: 36, borderRadius: 10, objectFit: "contain", boxShadow: "0 4px 12px rgba(26,239,34,0.3)" }} />
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: -0.5, color: "#F5F5F5" }}>Qeixova</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Link href="/login" style={{ fontSize: 14, fontWeight: 600, color: "#1AEF22", textDecoration: "none", padding: "8px 16px" }}>Log in</Link>
          <Link href="/register" style={{ fontSize: 14, fontWeight: 700, color: "#000", textDecoration: "none", padding: "9px 20px", background: "linear-gradient(135deg, #1AEF22, #06B517)", borderRadius: 10, boxShadow: "0 4px 14px rgba(26,239,34,0.3)" }}>Get Started</Link>
        </div>
      </nav>

      <section style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)", padding: "80px 5vw 100px", position: "relative", overflow: "hidden", textAlign: "center", borderBottom: "1px solid #222222" }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: "rgba(26,239,34,0.03)" }} />
        <h1 style={{ color: "#F5F5F5", fontSize: "clamp(32px, 6vw, 64px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: -2, maxWidth: 760, margin: "0 auto 20px" }}>
          Complete Simple Tasks.<br />
          <span style={{ background: "linear-gradient(135deg, #1AEF22, #06B517)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Earn QLT.</span>
        </h1>
        <p style={{ color: "#b0b0b0", fontSize: "clamp(15px, 2vw, 19px)", maxWidth: 560, margin: "0 auto 16px", lineHeight: 1.6 }}>
          Turn your time into rewards by completing social tasks, app testing, surveys, and AI evaluations. Convert your <strong style={{ color: "#F5A623" }}>QLT</strong> to Naira anytime.
        </p>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#111111", border: "1px solid #333333", borderRadius: 14, padding: "10px 20px", marginBottom: 36 }}>
          <span style={{ color: "#F5A623", fontSize: 14, fontWeight: 700 }}>100 QLT = ₦1</span>
          <span style={{ color: "#999999", fontSize: 12 }}>• Transparent conversion • No hidden conditions</span>
        </div>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/register" style={{ background: "linear-gradient(135deg, #F5A623, #d89420)", color: "#000", textDecoration: "none", padding: "16px 36px", borderRadius: 14, fontWeight: 800, fontSize: 16, boxShadow: "0 8px 28px rgba(245,166,35,0.4)" }}>
            Start Earning
          </Link>
          <a href="#how-it-works" style={{ background: "#1a1a1a", border: "1.5px solid #333333", color: "#F5F5F5", textDecoration: "none", padding: "16px 32px", borderRadius: 14, fontWeight: 600, fontSize: 16 }}>
            See How It Works
          </a>
        </div>
        <p style={{ color: "#666666", fontSize: 13, marginTop: 16 }}>No experience needed. Get started in minutes.</p>
      </section>

      {/* Trust Strip */}
      <section style={{ background: "#111111", borderBottom: "1px solid #222222", padding: "20px 5vw" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 32, flexWrap: "wrap" }}>
          {trustItems.map(item => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#1AEF22", flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: "#b0b0b0", fontWeight: 500 }}>{item}</span>
            </div>
          ))}
        </div>
        <p style={{ textAlign: "center", fontSize: 12, color: "#555555", marginTop: 12 }}>Early users are already completing tasks daily.</p>
      </section>

      <section style={{ padding: "80px 5vw", background: "#0a0a0a" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#1AEF22", letterSpacing: 2, textTransform: "uppercase", background: "rgba(26,239,34,0.1)", borderRadius: 20, padding: "4px 14px" }}>What you can do</span>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 900, color: "#F5F5F5", marginTop: 14, letterSpacing: -1 }}>Four task types. One platform.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {features.map(f => (
              <div key={f.title} style={{ background: "#111111", borderRadius: 20, padding: "28px 24px", border: "1px solid #222222", textAlign: "center" }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: f.color, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
                  <Image src={f.icon} alt={f.title} width={32} height={32} style={{ objectFit: "contain" }} />
                </div>
                <h3 style={{ fontWeight: 800, fontSize: 16, color: "#F5F5F5", marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: "#b0b0b0", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" style={{ padding: "80px 5vw", background: "#000000" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#1AEF22", letterSpacing: 2, textTransform: "uppercase", background: "rgba(26,239,34,0.1)", borderRadius: 20, padding: "4px 14px" }}>Simple process</span>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 900, color: "#F5F5F5", marginTop: 14, letterSpacing: -1 }}>How Qeixova Tasks Works</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 32 }}>
            {steps.map(step => (
              <div key={step.num} style={{ textAlign: "center" }}>
                <div style={{ width: 68, height: 68, borderRadius: "50%", background: "#1a1a1a", border: "2px solid #1AEF22", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: "0 6px 20px rgba(26,239,34,0.2)", flexDirection: "column" }}>
                  <span style={{ fontSize: 28, fontWeight: 800, color: "#F5F5F5" }}>{step.icon}</span>
                </div>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#F5A623", letterSpacing: 1, marginBottom: 6 }}>STEP {step.num}</p>
                <h3 style={{ fontWeight: 700, fontSize: 15, color: "#F5F5F5", marginBottom: 8 }}>{step.title}</h3>
                <p style={{ fontSize: 13, color: "#b0b0b0", lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "80px 5vw", background: "#000000" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#1AEF22", letterSpacing: 2, textTransform: "uppercase", background: "rgba(26,239,34,0.1)", borderRadius: 20, padding: "4px 14px" }}>FAQ</span>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 900, color: "#F5F5F5", marginTop: 14, letterSpacing: -1 }}>Common questions</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ background: openFaq === i ? "#111111" : "#0a0a0a", border: `1.5px solid ${openFaq === i ? "rgba(26,239,34,0.3)" : "#222222"}`, borderRadius: 16, overflow: "hidden" }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: "100%", padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: "#F5F5F5" }}>{faq.q}</span>
                  <span style={{ width: 28, height: 28, borderRadius: 8, background: openFaq === i ? "#1AEF22" : "#222222", display: "flex", alignItems: "center", justifyContent: "center", color: openFaq === i ? "#000" : "#b0b0b0", fontSize: 18, fontWeight: 700, flexShrink: 0 }}>
                    {openFaq === i ? "-" : "+"}
                  </span>
                </button>
                {openFaq === i && <p style={{ padding: "0 20px 18px", fontSize: 14, color: "#b0b0b0", lineHeight: 1.7 }}>{faq.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "#0a0a0a", borderBottom: "1px solid #222222", padding: "80px 5vw", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 280, height: 280, borderRadius: "50%", background: "rgba(26,239,34,0.03)" }} />
        <h2 style={{ color: "#F5F5F5", fontSize: "clamp(26px, 5vw, 48px)", fontWeight: 900, letterSpacing: -1.5, marginBottom: 16, position: "relative" }}>Ready to start earning?</h2>
        <p style={{ color: "#b0b0b0", fontSize: 16, maxWidth: 440, margin: "0 auto 36px", lineHeight: 1.6, position: "relative" }}>
          Join users already completing tasks and converting QLT to real Naira daily.
        </p>
        <Link href="/register" style={{ background: "linear-gradient(135deg, #F5A623, #d89420)", color: "#000", textDecoration: "none", padding: "18px 44px", borderRadius: 14, fontWeight: 800, fontSize: 17, boxShadow: "0 8px 28px rgba(245,166,35,0.4)", display: "inline-block", position: "relative" }}>
          Start Earning
        </Link>
        <p style={{ color: "#999999", fontSize: 12, marginTop: 16 }}>Free forever. No experience needed.</p>
      </section>

      <footer style={{ background: "#000000", borderTop: "1px solid #222222", padding: "56px 5vw 32px", color: "#999999" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 40, marginBottom: 48 }}>

            {/* Brand */}
            <div style={{ gridColumn: "span 1" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <img src="/qeixova-icon.png" alt="Qeixova" style={{ width: 36, height: 36, borderRadius: 10, objectFit: "contain" }} />
                <span style={{ fontWeight: 800, fontSize: 18, color: "#F5F5F5", letterSpacing: -0.5 }}>Qeixova</span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.8, color: "#888888", maxWidth: 220 }}>
                Building systems that simplify execution.
              </p>
              <div style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.2)", borderRadius: 8, padding: "6px 12px" }}>
                <span style={{ fontSize: 12, color: "#F5A623", fontWeight: 700 }}>100 QLT = ₦1</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <p style={{ color: "#F5F5F5", fontWeight: 700, fontSize: 13, marginBottom: 16, letterSpacing: 0.3 }}>Quick Links</p>
              {[
                { label: "How it works", href: "#how-it-works" },
                { label: "Task categories", href: "#" },
                { label: "Points & rewards", href: "#" },
                { label: "Referral program", href: "#" },
              ].map(l => (
                <a key={l.label} href={l.href} style={{ display: "block", fontSize: 13, marginBottom: 10, color: "#888888", textDecoration: "none" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#F5F5F5")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#888888")}>
                  {l.label}
                </a>
              ))}
            </div>

            {/* Support */}
            <div>
              <p style={{ color: "#F5F5F5", fontWeight: 700, fontSize: 13, marginBottom: 16, letterSpacing: 0.3 }}>Support</p>
              {[
                { label: "Help center", href: "#" },
                { label: "Contact", href: "mailto:qeixova@gmail.com" },
                { label: "Privacy policy", href: "#" },
                { label: "Terms", href: "#" },
              ].map(l => (
                <a key={l.label} href={l.href} style={{ display: "block", fontSize: 13, marginBottom: 10, color: "#888888", textDecoration: "none" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#F5F5F5")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#888888")}>
                  {l.label}
                </a>
              ))}
            </div>

            {/* Social */}
            <div>
              <p style={{ color: "#F5F5F5", fontWeight: 700, fontSize: 13, marginBottom: 16, letterSpacing: 0.3 }}>Social</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <a href="https://x.com/QeixovaTech" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "#888888", textDecoration: "none" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#F5F5F5")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#888888")}>
                  @QeixovaTech
                </a>
                <a href="https://www.facebook.com/profile.php?id=61568026449468" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "#888888", textDecoration: "none" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#F5F5F5")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#888888")}>
                  Facebook
                </a>
                <a href="mailto:qeixova@gmail.com" style={{ fontSize: 13, color: "#888888", textDecoration: "none" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#F5F5F5")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#888888")}>
                  qeixova@gmail.com
                </a>
              </div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <p style={{ fontSize: 12, color: "#555555" }}>© 2025 Qeixova. All rights reserved.</p>
            <p style={{ fontSize: 12, color: "#555555" }}>Transparent. Simple. Built for earners.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
