"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

// ── Constants ────────────────────────────────────────────────────────────────
const BUSINESS_CATEGORIES = ["Local Business","Music & Entertainment","Creator Brand","Startup / App","Church / Community","Event Promotion","E-commerce","Personal Brand","Other"];
const BUSINESS_GOALS = ["Increase awareness","Promote content","Get reposts","Gain community visibility","Grow social pages","Get app testers","Generate referrals","Gather feedback","Promote events","Build audience engagement"];
const CONTRIBUTOR_INTERESTS = ["Music","Fashion","Sports","Technology","Gaming","Business","Church & Community","Lifestyle","Education","Entertainment","Food & Restaurants","Local Events"];
const PLATFORMS = ["Facebook","TikTok","Instagram","WhatsApp","X (Twitter)","Telegram","YouTube"];
const NIGERIAN_STATES = ["Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT (Abuja)","Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara"];

// ── Helpers ───────────────────────────────────────────────────────────────────
const inp: React.CSSProperties = { width:"100%", marginTop:7, padding:"13px 14px", borderRadius:11, border:"1.5px solid #1e1e1e", fontSize:14, outline:"none", color:"#F5F5F5", background:"#0d0d0d" };

function Chips({ options, selected, onChange, color="#1AEF22" }: { options:string[]; selected:string[]; onChange:(v:string[])=>void; color?:string }) {
  const toggle = (v:string) => onChange(selected.includes(v) ? selected.filter(s=>s!==v) : [...selected,v]);
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:8 }}>
      {options.map(o => {
        const on = selected.includes(o);
        return <button key={o} type="button" onClick={()=>toggle(o)} style={{ padding:"7px 14px", borderRadius:20, fontSize:12, cursor:"pointer", fontWeight:on?700:400, border:`1.5px solid ${on?color:"#1e1e1e"}`, background:on?`${color}18`:"transparent", color:on?color:"#bbb" }}>{o}</button>;
      })}
    </div>
  );
}

function StepBar({ current, total, color="#1AEF22" }: { current:number; total:number; color?:string }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:24 }}>
      {Array.from({length:total}).map((_,i) => (
        <div key={i} style={{ flex:1, height:3, borderRadius:3, background:i<current?color:"#1a1a1a", transition:"background 0.3s" }} />
      ))}
      <span style={{ fontSize:11, color:"#aaa", flexShrink:0 }}>{current}/{total}</span>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const router = useRouter();
  const [screen, setScreen] = useState<"welcome"|"type"|"signup"|"onboard"|"done">("welcome");
  const [accountType, setAccountType] = useState<"business"|"contributor"|null>(null);
  const [onboardStep, setOnboardStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Signup fields
  const [form, setForm] = useState({ fullName:"", email:"", password:"", confirmPassword:"", country:"Nigeria", state:"" });

  // Business onboarding
  const [bizCategory, setBizCategory] = useState("");
  const [bizDescription, setBizDescription] = useState("");
  const [bizGoals, setBizGoals] = useState<string[]>([]);

  // Contributor onboarding
  const [interests, setInterests] = useState<string[]>([]);
  const [platforms, setPlatforms] = useState<string[]>([]);

  const accentColor = accountType === "business" ? "#F5A623" : "#1AEF22";

  const handleSignup = async () => {
    if (!form.fullName || !form.email || !form.password) { setError("Please fill in all required fields."); return; }
    if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }
    if (!termsAccepted) { setError("Please accept the Terms of Service."); return; }
    setError(""); setLoading(true);

    if (accountType === "business") {
      const res = await fetch("/api/business/register", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ name:form.fullName, email:form.email, password:form.password, industry:bizCategory }),
      });
      const data = await res.json();
      if (res.ok) { setScreen("onboard"); setOnboardStep(1); }
      else setError(data.error || "Registration failed");
    } else {
      const res = await fetch("/api/auth/register", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ fullName:form.fullName, email:form.email, password:form.password }),
      });
      const data = await res.json();
      if (res.ok) { setScreen("onboard"); setOnboardStep(1); }
      else setError(data.error || "Registration failed");
    }
    setLoading(false);
  };

  const handleFinishOnboarding = async () => {
    setLoading(true);
    if (accountType === "contributor") {
      await fetch("/api/onboarding", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ interests, platforms, state:form.state }),
      });
    }
    setLoading(false);
    setScreen("done");
  };

  return (
    <div style={{ minHeight:"100vh", background:"#000", display:"flex", flexDirection:"column" }}>
      {/* Nav — only show on non-welcome screens */}
      {screen !== "welcome" && (
        <nav style={{ padding:"0 24px", height:60, display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:"1px solid #111" }}>
          <Link href="/" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
            <Image src="/qeixova-icon.png" alt="Qeixova" width={30} height={30} style={{ borderRadius:8, objectFit:"contain" }} />
            <span style={{ fontWeight:800, fontSize:15, color:"#F5F5F5" }}>Qeixova</span>
          </Link>
          <Link href="/login" style={{ fontSize:13, color:"#1AEF22", fontWeight:700, textDecoration:"none" }}>Sign in →</Link>
        </nav>
      )}

      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"32px 20px" }}>
        <div style={{ width:"100%", maxWidth:480 }}>

          {/* ── WELCOME ── */}
          {screen === "welcome" && (
            <div style={{ textAlign:"center", position:"relative" }}>
              {/* Particle-style glow bg */}
              <div style={{ position:"fixed", inset:0, background:"radial-gradient(ellipse at 50% 40%, rgba(26,239,34,0.06) 0%, transparent 70%)", pointerEvents:"none", zIndex:0 }} />

              <div style={{ position:"relative", zIndex:1 }}>
                <div className="animate-fade-up" style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:28 }}>
                  <div className="animate-float">
                    <Image src="/qeixova-icon.png" alt="Qeixova" width={56} height={56} style={{ borderRadius:16, objectFit:"contain", boxShadow:"0 8px 32px rgba(26,239,34,0.4)" }} />
                  </div>
                  <div style={{ textAlign:"left" }}>
                    <p style={{ fontWeight:900, fontSize:22, color:"#F5F5F5", letterSpacing:-0.5, lineHeight:1.1 }}>Qeixova</p>
                    <p style={{ fontSize:11, color:"#1AEF22", fontWeight:700, letterSpacing:1, textTransform:"uppercase" }}>Tasks</p>
                  </div>
                </div>

                <h1 className="animate-fade-up delay-1" style={{ fontSize:"clamp(24px, 5vw, 36px)", fontWeight:900, color:"#F5F5F5", letterSpacing:-0.5, marginBottom:12 }}>
                  Welcome to <span className="shimmer-text">Qeixova Tasks</span>
                </h1>
                <p className="animate-fade-up delay-2" style={{ fontSize:14, color:"#ccc", lineHeight:1.7, marginBottom:36, maxWidth:380, margin:"0 auto 36px" }}>
                  A community-powered growth platform where businesses gain visibility and contributors earn through meaningful participation.
                </p>

                <div className="animate-fade-up delay-3" style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {/* Business button — white */}
                  <button onClick={()=>{ setAccountType("business"); setScreen("type"); }}
                    style={{ width:"100%", background:"#ffffff", color:"#000", border:"none", borderRadius:13, padding:"15px", fontWeight:800, fontSize:15, cursor:"pointer", boxShadow:"0 6px 20px rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center", gap:10, transition:"all 0.2s ease" }}
                    onMouseEnter={e=>(e.currentTarget.style.boxShadow="0 8px 28px rgba(255,255,255,0.25)")}
                    onMouseLeave={e=>(e.currentTarget.style.boxShadow="0 6px 20px rgba(255,255,255,0.15)")}>
                    <Image src="/icon-local-business.svg" alt="Business" width={18} height={18} style={{ objectFit:"contain", filter:"brightness(0)" }} />
                    Continue as Business
                  </button>

                  {/* Contributor button — green */}
                  <button onClick={()=>{ setAccountType("contributor"); setScreen("type"); }}
                    style={{ width:"100%", background:"linear-gradient(135deg, #1AEF22, #06B517)", color:"#000", border:"none", borderRadius:13, padding:"15px", fontWeight:800, fontSize:15, cursor:"pointer", boxShadow:"0 6px 20px rgba(26,239,34,0.28)", display:"flex", alignItems:"center", justifyContent:"center", gap:10, transition:"all 0.2s ease" }}
                    onMouseEnter={e=>(e.currentTarget.style.boxShadow="0 8px 28px rgba(26,239,34,0.45)")}
                    onMouseLeave={e=>(e.currentTarget.style.boxShadow="0 6px 20px rgba(26,239,34,0.28)")}>
                    <Image src="/icon-community.svg" alt="Contributor" width={18} height={18} style={{ objectFit:"contain", filter:"brightness(0)" }} />
                    Continue as Contributor
                  </button>
                </div>

                <p className="animate-fade-up delay-4" style={{ fontSize:12, color:"#999", marginTop:16 }}>You can switch account types later.</p>
                <p className="animate-fade-up delay-5" style={{ fontSize:13, color:"#aaa", marginTop:10 }}>
                  Already have an account? <Link href="/login" style={{ color:"#1AEF22", textDecoration:"none", fontWeight:600 }}>Sign in</Link>
                </p>
              </div>
            </div>
          )}

          {/* ── TYPE SELECTION ── */}
          {screen === "type" && accountType && (
            <div>
              <button onClick={()=>setScreen("welcome")} style={{ background:"none", border:"none", color:"#bbb", fontSize:13, cursor:"pointer", marginBottom:20, padding:0 }}>← Back</button>
              {accountType === "business" ? (
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
                    <div style={{ width:52, height:52, borderRadius:14, background:"linear-gradient(135deg, #F5A623, #d89420)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>🏢</div>
                    <div>
                      <h2 style={{ fontSize:20, fontWeight:900, color:"#F5F5F5", marginBottom:3 }}>Business Account</h2>
                      <p style={{ fontSize:13, color:"#bbb" }}>Grow your brand through real human participation</p>
                    </div>
                  </div>
                  <p style={{ fontSize:14, color:"#ccc", lineHeight:1.7, marginBottom:20 }}>
                    Promote your business, music, events, products, videos, apps, or campaigns through real human participation.
                  </p>
                  <div style={{ background:"#0a0a0a", borderRadius:14, padding:"18px", border:"1px solid #1a1a1a", marginBottom:24 }}>
                    {["Launch awareness campaigns","Get reposts and shares","Run referral campaigns","Test products and apps","Gather feedback","Reach local communities"].map(f => (
                      <div key={f} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                        <span style={{ color:"#F5A623", fontSize:12 }}>✓</span>
                        <span style={{ fontSize:13, color:"#ccc" }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={()=>setScreen("signup")} style={{ width:"100%", background:"linear-gradient(135deg, #F5A623, #d89420)", color:"#000", border:"none", borderRadius:13, padding:"15px", fontWeight:800, fontSize:15, cursor:"pointer" }}>
                    Create Business Account →
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
                    <div style={{ width:52, height:52, borderRadius:14, background:"linear-gradient(135deg, #1AEF22, #06B517)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>👤</div>
                    <div>
                      <h2 style={{ fontSize:20, fontWeight:900, color:"#F5F5F5", marginBottom:3 }}>Contributor Account</h2>
                      <p style={{ fontSize:13, color:"#bbb" }}>Earn by helping businesses grow</p>
                    </div>
                  </div>
                  <p style={{ fontSize:14, color:"#ccc", lineHeight:1.7, marginBottom:20 }}>
                    Earn rewards by helping businesses and creators distribute content, test products, and grow online.
                  </p>
                  <div style={{ background:"#0a0a0a", borderRadius:14, padding:"18px", border:"1px solid #1a1a1a", marginBottom:24 }}>
                    {["Complete participation tasks","Earn QLT rewards","Build contributor level","Access better campaigns","Join growth communities"].map(f => (
                      <div key={f} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                        <span style={{ color:"#1AEF22", fontSize:12 }}>✓</span>
                        <span style={{ fontSize:13, color:"#ccc" }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={()=>setScreen("signup")} style={{ width:"100%", background:"linear-gradient(135deg, #1AEF22, #06B517)", color:"#000", border:"none", borderRadius:13, padding:"15px", fontWeight:800, fontSize:15, cursor:"pointer" }}>
                    Create Contributor Account →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── SIGNUP FORM ── */}
          {screen === "signup" && (
            <div>
              <button onClick={()=>setScreen("type")} style={{ background:"none", border:"none", color:"#bbb", fontSize:13, cursor:"pointer", marginBottom:20, padding:0 }}>← Back</button>
              <h2 style={{ fontSize:20, fontWeight:900, color:"#F5F5F5", marginBottom:4 }}>Create Your Account</h2>
              <p style={{ fontSize:13, color:"#bbb", marginBottom:20 }}>
                {accountType === "business" ? "Set up your business login." : "Set up your contributor account."}
              </p>
              {error && <div style={{ background:"rgba(229,62,62,0.07)", border:"1px solid rgba(229,62,62,0.2)", borderRadius:10, padding:"11px 14px", marginBottom:16, fontSize:13, color:"#e53e3e" }}>⚠️ {error}</div>}
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <div>
                  <label style={{ fontSize:11, fontWeight:700, color:"#aaa", letterSpacing:0.8, textTransform:"uppercase" }}>{accountType === "business" ? "Business Name" : "Full Name"}</label>
                  <input type="text" placeholder={accountType === "business" ? "Your company or brand name" : "Your full name"} value={form.fullName} onChange={e=>setForm(f=>({...f,fullName:e.target.value}))} style={inp} onFocus={e=>(e.target.style.borderColor=accentColor)} onBlur={e=>(e.target.style.borderColor="#1e1e1e")} />
                </div>
                <div>
                  <label style={{ fontSize:11, fontWeight:700, color:"#aaa", letterSpacing:0.8, textTransform:"uppercase" }}>Email Address</label>
                  <input type="email" placeholder="your@email.com" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} style={inp} onFocus={e=>(e.target.style.borderColor=accentColor)} onBlur={e=>(e.target.style.borderColor="#1e1e1e")} />
                </div>
                <div>
                  <label style={{ fontSize:11, fontWeight:700, color:"#aaa", letterSpacing:0.8, textTransform:"uppercase" }}>Password</label>
                  <input type="password" placeholder="Create a strong password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} style={inp} onFocus={e=>(e.target.style.borderColor=accentColor)} onBlur={e=>(e.target.style.borderColor="#1e1e1e")} />
                </div>
                <div>
                  <label style={{ fontSize:11, fontWeight:700, color:"#aaa", letterSpacing:0.8, textTransform:"uppercase" }}>Confirm Password</label>
                  <input type="password" placeholder="Repeat your password" value={form.confirmPassword} onChange={e=>setForm(f=>({...f,confirmPassword:e.target.value}))} style={inp} onFocus={e=>(e.target.style.borderColor=accentColor)} onBlur={e=>(e.target.style.borderColor="#1e1e1e")} />
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  <div>
                    <label style={{ fontSize:11, fontWeight:700, color:"#aaa", letterSpacing:0.8, textTransform:"uppercase" }}>Country</label>
                    <select value={form.country} onChange={e=>setForm(f=>({...f,country:e.target.value}))} style={{ ...inp, cursor:"pointer" }}>
                      <option value="Nigeria">Nigeria</option>
                      <option value="Ghana">Ghana</option>
                      <option value="Kenya">Kenya</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize:11, fontWeight:700, color:"#aaa", letterSpacing:0.8, textTransform:"uppercase" }}>State</label>
                    <select value={form.state} onChange={e=>setForm(f=>({...f,state:e.target.value}))} style={{ ...inp, cursor:"pointer" }}>
                      <option value="">Select state</option>
                      {NIGERIAN_STATES.map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"flex-start", gap:10, marginTop:4 }}>
                  <input type="checkbox" id="terms" checked={termsAccepted} onChange={e=>setTermsAccepted(e.target.checked)} style={{ marginTop:2, accentColor, width:16, height:16, cursor:"pointer", flexShrink:0 }} />
                  <label htmlFor="terms" style={{ fontSize:12, color:"#bbb", lineHeight:1.5, cursor:"pointer" }}>
                    I agree to the <Link href="/#" style={{ color:accentColor, textDecoration:"none", fontWeight:600 }}>Terms of Service</Link> and <Link href="/#" style={{ color:accentColor, textDecoration:"none", fontWeight:600 }}>Privacy Policy</Link>
                  </label>
                </div>
              </div>
              <button onClick={handleSignup} disabled={loading} style={{ width:"100%", marginTop:20, background:loading?"#111":`linear-gradient(135deg, ${accentColor}, ${accountType==="business"?"#d89420":"#06B517"})`, color:loading?"#aaa":"#000", border:"none", borderRadius:13, padding:"15px", fontWeight:800, fontSize:15, cursor:loading?"not-allowed":"pointer" }}>
                {loading ? "Creating account..." : "Continue →"}
              </button>
            </div>
          )}

          {/* ── ONBOARDING ── */}
          {screen === "onboard" && accountType === "business" && (
            <div>
              {onboardStep === 1 && (
                <div>
                  <StepBar current={1} total={2} color="#F5A623" />
                  <h2 style={{ fontSize:20, fontWeight:800, color:"#F5F5F5", marginBottom:4 }}>Business Setup</h2>
                  <p style={{ fontSize:13, color:"#bbb", marginBottom:20 }}>Help us match you with the right contributors.</p>
                  <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                    <div>
                      <label style={{ fontSize:11, fontWeight:700, color:"#aaa", letterSpacing:0.8, textTransform:"uppercase" }}>Business Category</label>
                      <select value={bizCategory} onChange={e=>setBizCategory(e.target.value)} style={{ ...inp, cursor:"pointer" }} onFocus={e=>(e.target.style.borderColor="#F5A623")} onBlur={e=>(e.target.style.borderColor="#1e1e1e")}>
                        <option value="">Select your category</option>
                        {BUSINESS_CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize:11, fontWeight:700, color:"#aaa", letterSpacing:0.8, textTransform:"uppercase" }}>Business Description (optional)</label>
                      <textarea value={bizDescription} onChange={e=>setBizDescription(e.target.value)} placeholder="Briefly describe your business or campaign..." rows={3} style={{ ...inp, resize:"vertical", lineHeight:1.6 }} onFocus={e=>(e.target.style.borderColor="#F5A623")} onBlur={e=>(e.target.style.borderColor="#1e1e1e")} />
                    </div>
                  </div>
                  <button onClick={()=>setOnboardStep(2)} style={{ width:"100%", marginTop:20, background:"linear-gradient(135deg, #F5A623, #d89420)", color:"#000", border:"none", borderRadius:13, padding:"14px", fontWeight:800, fontSize:14, cursor:"pointer" }}>Continue →</button>
                  <button onClick={()=>setOnboardStep(2)} style={{ width:"100%", marginTop:8, padding:"10px", borderRadius:12, border:"none", background:"transparent", color:"#aaa", fontSize:12, cursor:"pointer" }}>Skip for now</button>
                </div>
              )}
              {onboardStep === 2 && (
                <div>
                  <StepBar current={2} total={2} color="#F5A623" />
                  <h2 style={{ fontSize:20, fontWeight:800, color:"#F5F5F5", marginBottom:4 }}>What would you like to achieve?</h2>
                  <p style={{ fontSize:13, color:"#bbb", marginBottom:16 }}>Select all that apply.</p>
                  <Chips options={BUSINESS_GOALS} selected={bizGoals} onChange={setBizGoals} color="#F5A623" />
                  <div style={{ background:"#0a0a0a", borderRadius:14, padding:"16px", border:"1px solid #1a1a1a", marginTop:20, marginBottom:20 }}>
                    <p style={{ fontSize:13, fontWeight:700, color:"#F5A623", marginBottom:8 }}>🚀 Create Your First Campaign</p>
                    <p style={{ fontSize:12, color:"#bbb", lineHeight:1.6, marginBottom:12 }}>Qeixova campaigns help real people distribute and amplify your content across digital communities.</p>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                      {["WhatsApp Status","Facebook Repost","TikTok Promotion","Flyer Distribution","Referral Campaign","Music Promotion","App Testing"].map(t=>(
                        <span key={t} style={{ fontSize:11, color:"#F5A623", background:"rgba(245,166,35,0.08)", border:"1px solid rgba(245,166,35,0.15)", borderRadius:20, padding:"3px 10px" }}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <button onClick={handleFinishOnboarding} disabled={loading} style={{ width:"100%", background:"linear-gradient(135deg, #F5A623, #d89420)", color:"#000", border:"none", borderRadius:13, padding:"14px", fontWeight:800, fontSize:14, cursor:"pointer" }}>
                    {loading ? "Saving..." : "Launch My First Campaign →"}
                  </button>
                  <button onClick={handleFinishOnboarding} style={{ width:"100%", marginTop:8, padding:"10px", borderRadius:12, border:"none", background:"transparent", color:"#aaa", fontSize:12, cursor:"pointer" }}>Skip — go to dashboard</button>
                </div>
              )}
            </div>
          )}

          {screen === "onboard" && accountType === "contributor" && (
            <div>
              {onboardStep === 1 && (
                <div>
                  <StepBar current={1} total={3} />
                  <h2 style={{ fontSize:20, fontWeight:800, color:"#F5F5F5", marginBottom:4 }}>Choose Your Interests</h2>
                  <p style={{ fontSize:13, color:"#bbb", marginBottom:4 }}>Your interests help us recommend relevant campaigns and tasks.</p>
                  <Chips options={CONTRIBUTOR_INTERESTS} selected={interests} onChange={setInterests} />
                  <button onClick={()=>setOnboardStep(2)} style={{ width:"100%", marginTop:20, background:"linear-gradient(135deg, #1AEF22, #06B517)", color:"#000", border:"none", borderRadius:13, padding:"14px", fontWeight:800, fontSize:14, cursor:"pointer" }}>Continue →</button>
                  <button onClick={()=>setOnboardStep(2)} style={{ width:"100%", marginTop:8, padding:"10px", borderRadius:12, border:"none", background:"transparent", color:"#aaa", fontSize:12, cursor:"pointer" }}>Skip for now</button>
                </div>
              )}
              {onboardStep === 2 && (
                <div>
                  <StepBar current={2} total={3} />
                  <h2 style={{ fontSize:20, fontWeight:800, color:"#F5F5F5", marginBottom:4 }}>Connect Your Platforms</h2>
                  <p style={{ fontSize:13, color:"#bbb", marginBottom:4 }}>Campaigns are matched to platforms you&apos;re active on.</p>
                  <p style={{ fontSize:11, color:"#999", marginBottom:8 }}>Accounts may be reviewed for authenticity and activity quality.</p>
                  <Chips options={PLATFORMS} selected={platforms} onChange={setPlatforms} />
                  <button onClick={()=>setOnboardStep(3)} style={{ width:"100%", marginTop:20, background:"linear-gradient(135deg, #1AEF22, #06B517)", color:"#000", border:"none", borderRadius:13, padding:"14px", fontWeight:800, fontSize:14, cursor:"pointer" }}>Continue →</button>
                  <button onClick={()=>setOnboardStep(3)} style={{ width:"100%", marginTop:8, padding:"10px", borderRadius:12, border:"none", background:"transparent", color:"#aaa", fontSize:12, cursor:"pointer" }}>Skip for now</button>
                </div>
              )}
              {onboardStep === 3 && (
                <div>
                  <StepBar current={3} total={3} />
                  <h2 style={{ fontSize:20, fontWeight:800, color:"#F5F5F5", marginBottom:4 }}>Contributor Verification</h2>
                  <p style={{ fontSize:13, color:"#bbb", marginBottom:20 }}>We verify contributors to protect campaign quality and ensure businesses receive authentic participation.</p>
                  <div style={{ background:"#0a0a0a", borderRadius:14, padding:"18px", border:"1px solid #1a1a1a", marginBottom:20 }}>
                    {["Active account history","Real profile photo","Engagement consistency","Spam prevention review"].map(c=>(
                      <div key={c} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                        <span style={{ color:"#1AEF22", fontSize:12 }}>✓</span>
                        <span style={{ fontSize:13, color:"#ccc" }}>{c}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ background:"rgba(26,239,34,0.06)", border:"1px solid rgba(26,239,34,0.12)", borderRadius:12, padding:"14px", marginBottom:20 }}>
                    <p style={{ fontSize:13, fontWeight:700, color:"#1AEF22", marginBottom:6 }}>Your Dashboard Includes:</p>
                    {["Recommended Campaigns","Available Tasks","Earnings Wallet","Performance Level","Referral System"].map(s=>(
                      <div key={s} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                        <span style={{ color:"#1AEF22", fontSize:10 }}>→</span>
                        <span style={{ fontSize:12, color:"#ccc" }}>{s}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={handleFinishOnboarding} disabled={loading} style={{ width:"100%", background:"linear-gradient(135deg, #1AEF22, #06B517)", color:"#000", border:"none", borderRadius:13, padding:"14px", fontWeight:800, fontSize:14, cursor:"pointer" }}>
                    {loading ? "Saving..." : "Explore Campaigns →"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── DONE ── */}
          {screen === "done" && (
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:64, marginBottom:20 }}>{accountType === "business" ? "🏢" : "🎉"}</div>
              <h2 style={{ fontSize:24, fontWeight:900, color:"#F5F5F5", marginBottom:12, letterSpacing:-0.5 }}>
                {accountType === "business" ? "Welcome to a smarter way to grow visibility through real human participation." : "Welcome to a new way to earn through meaningful digital participation."}
              </h2>
              <p style={{ fontSize:14, color:"#bbb", lineHeight:1.7, marginBottom:32 }}>
                {accountType === "business" ? "Your business account is ready. Create your first campaign and start reaching real people." : "Your contributor account is ready. Start completing tasks and earning QLT rewards."}
              </p>
              <button onClick={()=>router.push(accountType === "business" ? "/business/dashboard" : "/tasks")} style={{ width:"100%", background:`linear-gradient(135deg, ${accountType==="business"?"#F5A623, #d89420":"#1AEF22, #06B517"})`, color:"#000", border:"none", borderRadius:13, padding:"16px", fontWeight:800, fontSize:16, cursor:"pointer" }}>
                {accountType === "business" ? "Launch Your First Campaign →" : "Start Completing Tasks →"}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
