"use client";
import Link from "next/link";
import { useState } from "react";

const features = [
  { icon: "📱", title: "Social Media Tasks", desc: "Follow, like, share and engage with content across Instagram, TikTok, X and more.", earn: "10,000 - 15,000 QLT", color: "rgba(26,239,34,0.1)" },
  { icon: "📋", title: "Surveys & Polls", desc: "Share your opinion on products, services and lifestyle topics that matter.", earn: "35,000 - 50,000 QLT", color: "rgba(245,166,35,0.1)" },
  { icon: "📲", title: "App Testing", desc: "Test new mobile apps and websites before they launch. Your feedback shapes products.", earn: "80,000 - 120,000 QLT", color: "rgba(26,239,34,0.1)" },
  { icon: "🎬", title: "Content Interactions", desc: "Watch videos, read articles and interact with digital content to earn rewards.", earn: "18,000 - 20,000 QLT", color: "rgba(245,166,35,0.1)" },
];

const steps = [
  { num: "01", icon: "👤", title: "Create your account", desc: "Sign up with a referral code in under 60 seconds. No credit card needed." },
  { num: "02", icon: "✅", title: "Complete tasks", desc: "Browse tasks by category, follow the steps and submit proof of completion." },
  { num: "03", icon: "⭐", title: "Earn points", desc: "Every completed task credits points to your balance instantly." },
  { num: "04", icon: "💸", title: "Convert & withdraw", desc: "Convert your points to Naira and cash out to your bank or mobile wallet." },
];

const stats = [
  { value: "50,000+", label: "Active Earners" },
  { value: "5B+", label: "QLT Awarded" },
  { value: "200+", label: "Daily Tasks" },
  { value: "4.8", label: "User Rating" },
];

const testimonials = [
  { name: "Amaka O.", role: "Student, Lagos", text: "I earn thousands of QLT weekly just doing tasks in my free time. Converting to cash is instant. Qeixova is genuinely legit." },
  { name: "Chidi N.", role: "Freelancer, Abuja", text: "The app testing tasks give the most QLT. I have withdrawn over 80,000 worth in three months. Highly recommend." },
  { name: "Fatima B.", role: "Stay-at-home mum, Kano", text: "Simple tasks, fast QLT credits, easy cash out. I love doing this from my phone while the kids are asleep." },
];

const faqs = [
  { q: "What are QLT Points?", a: "QLT (Qeixova Loyalty Token) points are the reward currency on Qeixova. Every task you complete earns you QLT. 100 QLT = 1 Naira. You can convert and withdraw anytime." },
  { q: "Is Qeixova free to join?", a: "Yes, completely free. You need a referral code from an existing member to register. No registration fee, no hidden charges." },
  { q: "How do I convert points to cash?", a: "Go to your Wallet, enter the amount of QLT you want to convert, select your bank account and tap Withdraw. Minimum is 100,000 QLT." },
  { q: "How quickly are withdrawals processed?", a: "Withdrawals are processed instantly to your bank account or mobile wallet (Opay, Palmpay, GTBank, etc.)." },
  { q: "How many tasks can I do per day?", a: "There is no daily limit. New tasks are added every 24 hours so there is always something to earn from." },
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
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(26,239,34,0.08)", border: "1px solid rgba(26,239,34,0.2)", borderRadius: 20, padding: "6px 16px", marginBottom: 28 }}>
          <span>🔥</span>
          <span style={{ color: "#1AEF22", fontSize: 13, fontWeight: 700 }}>50,000+ Nigerians already earning</span>
        </div>
        <h1 style={{ color: "#F5F5F5", fontSize: "clamp(32px, 6vw, 64px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: -2, maxWidth: 760, margin: "0 auto 20px" }}>
          Complete Tasks. Earn Points.<br />
          <span style={{ background: "linear-gradient(135deg, #1AEF22, #06B517)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Convert to Real Cash.</span>
        </h1>
        <p style={{ color: "#888888", fontSize: "clamp(15px, 2vw, 19px)", maxWidth: 560, margin: "0 auto 16px", lineHeight: 1.6 }}>
          Qeixova rewards you with <strong style={{ color: "#F5A623" }}>QLT Points</strong> for completing simple online tasks. Accumulate QLT and convert to Naira whenever you want.
        </p>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#111111", border: "1px solid #333333", borderRadius: 14, padding: "10px 20px", marginBottom: 36 }}>
          <span style={{ fontSize: 20 }}>⭐</span>
          <span style={{ color: "#F5A623", fontSize: 14, fontWeight: 700 }}>100 QLT = 1 Naira</span>
          <span style={{ color: "#555555", fontSize: 12 }}>Instant conversion</span>
        </div>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/register" style={{ background: "linear-gradient(135deg, #F5A623, #d89420)", color: "#000", textDecoration: "none", padding: "16px 36px", borderRadius: 14, fontWeight: 800, fontSize: 16, boxShadow: "0 8px 28px rgba(245,166,35,0.4)" }}>
            Start Earning Free
          </Link>
          <a href="#how-it-works" style={{ background: "#1a1a1a", border: "1.5px solid #333333", color: "#F5F5F5", textDecoration: "none", padding: "16px 32px", borderRadius: 14, fontWeight: 600, fontSize: 16 }}>
            See How It Works
          </a>
        </div>
      </section>

      <section style={{ background: "#111111", padding: "36px 5vw", borderBottom: "1px solid #222222" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ color: "#555555", fontSize: 14 }}>How QLT works:</span>
          {[{ pts: "100 QLT", naira: "1 Naira" }, { pts: "10,000 QLT", naira: "100 Naira" }, { pts: "100,000 QLT", naira: "1,000 Naira" }, { pts: "1,000,000 QLT", naira: "10,000 Naira" }].map(r => (
            <div key={r.pts} style={{ display: "flex", alignItems: "center", gap: 6, background: "#1a1a1a", border: "1px solid #333333", borderRadius: 10, padding: "8px 14px" }}>
              <span style={{ color: "#F5A623", fontWeight: 700, fontSize: 13 }}>⭐ {r.pts}</span>
              <span style={{ color: "#444444" }}>→</span>
              <span style={{ color: "#F5F5F5", fontWeight: 700, fontSize: 13 }}>{r.naira}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: "#000000", borderBottom: "1px solid #222222", padding: "48px 5vw" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 24, textAlign: "center" }}>
          {stats.map(s => (
            <div key={s.label}>
              <p style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 900, color: "#1AEF22", letterSpacing: -1, lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: 13, color: "#555555", marginTop: 6, fontWeight: 500 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "80px 5vw", background: "#0a0a0a" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#1AEF22", letterSpacing: 2, textTransform: "uppercase", background: "rgba(26,239,34,0.1)", borderRadius: 20, padding: "4px 14px" }}>What you can do</span>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 900, color: "#F5F5F5", marginTop: 14, letterSpacing: -1 }}>Four ways to earn points every day</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {features.map(f => (
              <div key={f.title} style={{ background: "#111111", borderRadius: 20, padding: "28px 24px", border: "1px solid #222222" }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: f.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, marginBottom: 18 }}>{f.icon}</div>
                <h3 style={{ fontWeight: 800, fontSize: 16, color: "#F5F5F5", marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: "#888888", lineHeight: 1.6, marginBottom: 16 }}>{f.desc}</p>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(245,166,35,0.1)", borderRadius: 8, padding: "5px 12px" }}>
                  <span style={{ fontSize: 14 }}>⭐</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#F5A623" }}>{f.earn} per task</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" style={{ padding: "80px 5vw", background: "#000000" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#1AEF22", letterSpacing: 2, textTransform: "uppercase", background: "rgba(26,239,34,0.1)", borderRadius: 20, padding: "4px 14px" }}>Simple process</span>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 900, color: "#F5F5F5", marginTop: 14, letterSpacing: -1 }}>Up and earning in 4 steps</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 32 }}>
            {steps.map(step => (
              <div key={step.num} style={{ textAlign: "center" }}>
                <div style={{ width: 68, height: 68, borderRadius: "50%", background: "#1a1a1a", border: "2px solid #1AEF22", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: "0 6px 20px rgba(26,239,34,0.2)", flexDirection: "column" }}>
                  <span style={{ fontSize: 22 }}>{step.icon}</span>
                </div>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#F5A623", letterSpacing: 1, marginBottom: 6 }}>STEP {step.num}</p>
                <h3 style={{ fontWeight: 700, fontSize: 15, color: "#F5F5F5", marginBottom: 8 }}>{step.title}</h3>
                <p style={{ fontSize: 13, color: "#888888", lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "80px 5vw", background: "#0a0a0a" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#1AEF22", letterSpacing: 2, textTransform: "uppercase", background: "rgba(26,239,34,0.1)", borderRadius: 20, padding: "4px 14px" }}>Real earners</span>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 900, color: "#F5F5F5", marginTop: 14, letterSpacing: -1 }}>People just like you are earning</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {testimonials.map(t => (
              <div key={t.name} style={{ background: "#111111", borderRadius: 20, padding: "28px 24px", border: "1px solid #222222" }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                  {[...Array(5)].map((_, i) => <span key={i} style={{ color: "#F5A623", fontSize: 16 }}>⭐</span>)}
                </div>
                <p style={{ fontSize: 14, color: "#aaaaaa", lineHeight: 1.7, marginBottom: 20, fontStyle: "italic" }}>&ldquo;{t.text}&rdquo;</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(26,239,34,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>👤</div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 14, color: "#F5F5F5" }}>{t.name}</p>
                    <p style={{ fontSize: 12, color: "#555555" }}>{t.role}</p>
                  </div>
                </div>
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
                  <span style={{ width: 28, height: 28, borderRadius: 8, background: openFaq === i ? "#1AEF22" : "#222222", display: "flex", alignItems: "center", justifyContent: "center", color: openFaq === i ? "#000" : "#888888", fontSize: 18, fontWeight: 700, flexShrink: 0 }}>
                    {openFaq === i ? "-" : "+"}
                  </span>
                </button>
                {openFaq === i && <p style={{ padding: "0 20px 18px", fontSize: 14, color: "#888888", lineHeight: 1.7 }}>{faq.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "#0a0a0a", borderBottom: "1px solid #222222", padding: "80px 5vw", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 280, height: 280, borderRadius: "50%", background: "rgba(26,239,34,0.03)" }} />
        <h2 style={{ color: "#F5F5F5", fontSize: "clamp(26px, 5vw, 48px)", fontWeight: 900, letterSpacing: -1.5, marginBottom: 16, position: "relative" }}>Ready to start earning points?</h2>
        <p style={{ color: "#888888", fontSize: 16, maxWidth: 440, margin: "0 auto 36px", lineHeight: 1.6, position: "relative" }}>
          Join thousands of Nigerians earning QLT daily and converting them to real cash.
        </p>
        <Link href="/register" style={{ background: "linear-gradient(135deg, #F5A623, #d89420)", color: "#000", textDecoration: "none", padding: "18px 44px", borderRadius: 14, fontWeight: 800, fontSize: 17, boxShadow: "0 8px 28px rgba(245,166,35,0.4)", display: "inline-block", position: "relative" }}>
          Create Free Account
        </Link>
        <p style={{ color: "#555555", fontSize: 12, marginTop: 16 }}>Referral code required. Free forever.</p>
      </section>

      <footer style={{ background: "#000000", borderTop: "1px solid #222222", padding: "48px 5vw 32px", color: "#555555" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 32, marginBottom: 40 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <img src="/qeixova-icon.png" alt="Qeixova" style={{ width: 32, height: 32, borderRadius: 8, objectFit: "contain" }} />
                <span style={{ fontWeight: 800, fontSize: 16, color: "#F5F5F5" }}>Qeixova</span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.7 }}>Nigeria&apos;s most trusted micro-task platform. Earn QLT doing simple online tasks and convert to real cash.</p>
              <div style={{ marginTop: 14, display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.2)", borderRadius: 8, padding: "6px 12px" }}>
                <span style={{ fontSize: 14 }}>⭐</span>
                <span style={{ fontSize: 12, color: "#F5A623", fontWeight: 700 }}>100 QLT = 1 Naira</span>
              </div>
            </div>
            <div>
              <p style={{ color: "#F5F5F5", fontWeight: 700, fontSize: 13, marginBottom: 14 }}>Platform</p>
              {["How it works", "Task categories", "Points and rewards", "Referral program"].map(l => (
                <p key={l} style={{ fontSize: 13, marginBottom: 10, cursor: "pointer" }}>{l}</p>
              ))}
            </div>
            <div>
              <p style={{ color: "#F5F5F5", fontWeight: 700, fontSize: 13, marginBottom: 14 }}>Support</p>
              {[{ label: "Help center", href: "#" }, { label: "Contact us", href: "mailto:qeixova@gmail.com" }, { label: "Privacy policy", href: "#" }, { label: "Terms of service", href: "#" }].map(l => (
                <a key={l.label} href={l.href} style={{ display: "block", fontSize: 13, marginBottom: 10, color: "#555555", textDecoration: "none" }}>{l.label}</a>
              ))}
            </div>
            <div>
              <p style={{ color: "#F5F5F5", fontWeight: 700, fontSize: 13, marginBottom: 14 }}>Follow us</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <a href="https://www.facebook.com/profile.php?id=61568026449468" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, background: "#111111", borderRadius: 8, padding: "6px 12px", border: "1px solid #333333", color: "#888888", textDecoration: "none" }}>Facebook</a>
                <a href="https://x.com/QeixovaTech" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, background: "#111111", borderRadius: 8, padding: "6px 12px", border: "1px solid #333333", color: "#888888", textDecoration: "none" }}>@QeixovaTech</a>
                <a href="mailto:qeixova@gmail.com" style={{ fontSize: 12, background: "#111111", borderRadius: 8, padding: "6px 12px", border: "1px solid #333333", color: "#888888", textDecoration: "none" }}>Email us</a>
              </div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid #222222", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <p style={{ fontSize: 12 }}>2025 Qeixova. All rights reserved.</p>
            <p style={{ fontSize: 12 }}>Made with love for Nigerian earners</p>
          </div>
        </div>
      </footer>
    </div>
  );
}