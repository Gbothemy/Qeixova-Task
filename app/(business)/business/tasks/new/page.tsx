"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BusinessSidebar from "@/components/BusinessSidebar";

const CATEGORIES = ["Social Media", "Survey", "App Testing", "Content", "AI Testing"];
const PROOF_TYPES = [
  { value: "screenshot", label: "Screenshot" },
  { value: "url", label: "URL / Link" },
  { value: "text", label: "Text / Code" },
  { value: "none", label: "No proof needed" },
];
const PROFESSIONS = ["Student", "Employed (Full-time)", "Employed (Part-time)", "Self-employed / Freelancer", "Business Owner", "Job Seeker", "Stay-at-home Parent", "Creative (Designer/Writer/Artist)", "Tech Professional", "Healthcare Worker", "Educator / Teacher", "Finance / Banking", "Government / Civil Service", "Other"];
const INTERESTS = ["Technology & Gadgets", "Fashion & Beauty", "Food & Restaurants", "Finance & Investment", "Gaming", "Health & Fitness", "Travel", "Entertainment & Movies", "Sports", "Education & Learning", "Real Estate", "Business & Entrepreneurship", "Parenting & Family", "Politics & News"];
const PLATFORMS = ["Instagram", "TikTok", "X (Twitter)", "YouTube", "Facebook", "LinkedIn", "WhatsApp"];
const AGE_RANGES = ["18–24", "25–34", "35–44", "45+"];
const NIGERIAN_STATES = ["Lagos", "Abuja (FCT)", "Kano", "Rivers", "Oyo", "Kaduna", "Anambra", "Delta", "Edo", "Ogun", "Imo", "Enugu", "Plateau", "Borno", "Katsina", "Sokoto", "Bauchi", "Adamawa", "Cross River", "Akwa Ibom", "Abia", "Ebonyi", "Ekiti", "Gombe", "Jigawa", "Kebbi", "Kogi", "Kwara", "Nasarawa", "Niger", "Ondo", "Osun", "Taraba", "Yobe", "Zamfara", "Bayelsa", "Benue"];

function MultiSelect({ label, options, selected, onChange, color = "#1AEF22" }: { label: string; options: string[]; selected: string[]; onChange: (v: string[]) => void; color?: string }) {
  const toggle = (v: string) => onChange(selected.includes(v) ? selected.filter(s => s !== v) : [...selected, v]);
  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 700, color: "#666666", letterSpacing: 0.5 }}>{label} <span style={{ color: "#555", fontWeight: 400 }}>(optional — leave empty for all)</span></label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
        {options.map(o => {
          const sel = selected.includes(o);
          return (
            <button key={o} type="button" onClick={() => toggle(o)}
              style={{ padding: "6px 12px", borderRadius: 20, border: `1.5px solid ${sel ? color : "#333333"}`, background: sel ? `${color}18` : "transparent", color: sel ? color : "#888888", fontSize: 12, cursor: "pointer", fontWeight: sel ? 700 : 400 }}>
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function CreateTaskPage() {
  const router = useRouter();
  const [business, setBusiness] = useState<{ name: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [steps, setSteps] = useState<string[]>(["", "", ""]);

  const [form, setForm] = useState({
    title: "", category: "Social Media", reward: "", duration: "5 min",
    instructions: "", proof_type: "screenshot", proof_label: "Upload screenshot as proof",
    max_screenshots: 1, task_link: "", total_budget: "", target_completion_count: "",
  });
  const [targeting, setTargeting] = useState({
    target_professions: [] as string[], target_interests: [] as string[],
    target_platforms: [] as string[], target_age_ranges: [] as string[],
    target_genders: [] as string[], target_states: [] as string[],
  });

  useEffect(() => {
    fetch("/api/business/me").then(r => { if (!r.ok) { router.push("/business/login"); return null; } return r.json(); })
      .then(d => { if (d?.business) setBusiness(d.business); });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError("");
    const res = await fetch("/api/business/tasks", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, steps: steps.filter(s => s.trim()), ...targeting }),
    });
    const data = await res.json();
    if (res.ok) setSuccess(true);
    else setError(data.error || "Failed to create task");
    setSaving(false);
  };

  if (!business) return <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: "#888" }}>Loading...</p></div>;

  if (success) return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#000000" }}>
      <BusinessSidebar name={business.name} />
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>✅</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#F5F5F5", marginBottom: 12 }}>Task Submitted!</h2>
          <p style={{ fontSize: 15, color: "#888888", lineHeight: 1.7, marginBottom: 28 }}>
            Your task has been submitted for review. Our team will approve it within 24 hours. Once approved, it will be visible to your target audience.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => router.push("/business/tasks")} style={{ flex: 1, padding: "12px", borderRadius: 10, border: "1px solid #333", background: "transparent", color: "#F5F5F5", fontWeight: 600, cursor: "pointer" }}>
              View Tasks
            </button>
            <button onClick={() => { setSuccess(false); setForm(f => ({ ...f, title: "", instructions: "" })); setSteps(["", "", ""]); }} style={{ flex: 1, padding: "12px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #1AEF22, #06B517)", color: "#000", fontWeight: 800, cursor: "pointer" }}>
              Create Another
            </button>
          </div>
        </div>
      </main>
    </div>
  );

  const inputStyle = { width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #333333", fontSize: 14, outline: "none", color: "#F5F5F5", background: "#1a1a1a" };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#000000" }}>
      <BusinessSidebar name={business.name} />
      <main style={{ flex: 1, padding: "40px 32px", overflowY: "auto", maxWidth: 800 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#F5F5F5", marginBottom: 4 }}>Create a Task</h1>
        <p style={{ fontSize: 14, color: "#888888", marginBottom: 32 }}>Tasks are reviewed by our team before going live.</p>

        {error && <div style={{ background: "rgba(229,62,62,0.1)", border: "1px solid rgba(229,62,62,0.3)", borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#e53e3e" }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 28 }}>

          {/* Basic Info */}
          <section>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#1AEF22", letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>Task Details</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#666666", letterSpacing: 0.5 }}>TASK TITLE *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Follow our Instagram account" required style={{ ...inputStyle, marginTop: 6 }} onFocus={e => (e.target.style.borderColor = "#1AEF22")} onBlur={e => (e.target.style.borderColor = "#333333")} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#666666", letterSpacing: 0.5 }}>CATEGORY *</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ ...inputStyle, marginTop: 6, cursor: "pointer" }}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#666666", letterSpacing: 0.5 }}>DURATION</label>
                  <select value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} style={{ ...inputStyle, marginTop: 6, cursor: "pointer" }}>
                    {["1 min", "2 min", "5 min", "10 min", "15 min", "30 min"].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#666666", letterSpacing: 0.5 }}>TASK INSTRUCTIONS *</label>
                <textarea value={form.instructions} onChange={e => setForm(f => ({ ...f, instructions: e.target.value }))} placeholder="Describe what users need to do..." rows={3} required
                  style={{ ...inputStyle, marginTop: 6, resize: "vertical", lineHeight: 1.6 }} onFocus={e => (e.target.style.borderColor = "#1AEF22")} onBlur={e => (e.target.style.borderColor = "#333333")} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#666666", letterSpacing: 0.5 }}>STEP-BY-STEP GUIDE (optional)</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 6 }}>
                  {steps.map((step, i) => (
                    <input key={i} value={step} onChange={e => { const s = [...steps]; s[i] = e.target.value; setSteps(s); }}
                      placeholder={`Step ${i + 1}`} style={inputStyle} onFocus={e => (e.target.style.borderColor = "#1AEF22")} onBlur={e => (e.target.style.borderColor = "#333333")} />
                  ))}
                  <button type="button" onClick={() => setSteps(s => [...s, ""])} style={{ padding: "8px", borderRadius: 8, border: "1px dashed #333", background: "transparent", color: "#888", fontSize: 13, cursor: "pointer" }}>+ Add step</button>
                </div>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#666666", letterSpacing: 0.5 }}>TASK LINK (optional)</label>
                <input value={form.task_link} onChange={e => setForm(f => ({ ...f, task_link: e.target.value }))} placeholder="https://link-to-your-content.com" style={{ ...inputStyle, marginTop: 6 }} onFocus={e => (e.target.style.borderColor = "#1AEF22")} onBlur={e => (e.target.style.borderColor = "#333333")} />
              </div>
            </div>
          </section>

          {/* Proof */}
          <section>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#1AEF22", letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>Proof of Completion</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#666666", letterSpacing: 0.5 }}>PROOF TYPE</label>
                <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                  {PROOF_TYPES.map(p => (
                    <button key={p.value} type="button" onClick={() => setForm(f => ({ ...f, proof_type: p.value }))}
                      style={{ padding: "8px 16px", borderRadius: 20, border: `1.5px solid ${form.proof_type === p.value ? "#1AEF22" : "#333333"}`, background: form.proof_type === p.value ? "rgba(26,239,34,0.1)" : "transparent", color: form.proof_type === p.value ? "#1AEF22" : "#888888", fontSize: 13, cursor: "pointer", fontWeight: form.proof_type === p.value ? 700 : 400 }}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#666666", letterSpacing: 0.5 }}>PROOF INSTRUCTION</label>
                <input value={form.proof_label} onChange={e => setForm(f => ({ ...f, proof_label: e.target.value }))} placeholder="e.g. Upload a screenshot showing the task completed" style={{ ...inputStyle, marginTop: 6 }} onFocus={e => (e.target.style.borderColor = "#1AEF22")} onBlur={e => (e.target.style.borderColor = "#333333")} />
              </div>
            </div>
          </section>

          {/* Budget */}
          <section>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#F5A623", letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>Budget & Reach</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#666666", letterSpacing: 0.5 }}>QLT REWARD PER COMPLETION *</label>
                <input type="number" value={form.reward} onChange={e => setForm(f => ({ ...f, reward: e.target.value }))} placeholder="e.g. 15000" required min={1000} style={{ ...inputStyle, marginTop: 6 }} onFocus={e => (e.target.style.borderColor = "#F5A623")} onBlur={e => (e.target.style.borderColor = "#333333")} />
                {form.reward && <p style={{ fontSize: 11, color: "#F5A623", marginTop: 4 }}>≈ ₦{(Number(form.reward) / 100).toLocaleString()} per user</p>}
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#666666", letterSpacing: 0.5 }}>TARGET COMPLETIONS</label>
                <input type="number" value={form.target_completion_count} onChange={e => setForm(f => ({ ...f, target_completion_count: e.target.value }))} placeholder="e.g. 500" min={1} style={{ ...inputStyle, marginTop: 6 }} onFocus={e => (e.target.style.borderColor = "#F5A623")} onBlur={e => (e.target.style.borderColor = "#333333")} />
              </div>
            </div>
            {form.reward && form.target_completion_count && (
              <div style={{ marginTop: 12, background: "rgba(245,166,35,0.06)", border: "1px solid rgba(245,166,35,0.15)", borderRadius: 10, padding: "10px 14px" }}>
                <p style={{ fontSize: 13, color: "#F5A623" }}>
                  Estimated total: <strong>{(Number(form.reward) * Number(form.target_completion_count)).toLocaleString()} QLT</strong> ≈ ₦{((Number(form.reward) * Number(form.target_completion_count)) / 100).toLocaleString()}
                </p>
              </div>
            )}
          </section>

          {/* Targeting */}
          <section>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#4a9eff", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Audience Targeting</p>
            <p style={{ fontSize: 13, color: "#888888", marginBottom: 16 }}>Leave all empty to show to everyone. Select criteria to narrow your audience.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <MultiSelect label="PROFESSIONS" options={PROFESSIONS} selected={targeting.target_professions} onChange={v => setTargeting(t => ({ ...t, target_professions: v }))} />
              <MultiSelect label="AGE RANGES" options={AGE_RANGES} selected={targeting.target_age_ranges} onChange={v => setTargeting(t => ({ ...t, target_age_ranges: v }))} />
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#666666", letterSpacing: 0.5 }}>GENDER <span style={{ color: "#555", fontWeight: 400 }}>(optional)</span></label>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  {["Male", "Female", "All"].map(g => {
                    const sel = targeting.target_genders.includes(g);
                    return (
                      <button key={g} type="button" onClick={() => setTargeting(t => ({ ...t, target_genders: sel ? t.target_genders.filter(x => x !== g) : [...t.target_genders, g] }))}
                        style={{ padding: "7px 16px", borderRadius: 20, border: `1.5px solid ${sel ? "#1AEF22" : "#333333"}`, background: sel ? "rgba(26,239,34,0.1)" : "transparent", color: sel ? "#1AEF22" : "#888888", fontSize: 13, cursor: "pointer", fontWeight: sel ? 700 : 400 }}>
                        {g}
                      </button>
                    );
                  })}
                </div>
              </div>
              <MultiSelect label="STATES" options={NIGERIAN_STATES} selected={targeting.target_states} onChange={v => setTargeting(t => ({ ...t, target_states: v }))} />
              <MultiSelect label="INTERESTS" options={INTERESTS} selected={targeting.target_interests} onChange={v => setTargeting(t => ({ ...t, target_interests: v }))} />
              <MultiSelect label="PLATFORMS" options={PLATFORMS} selected={targeting.target_platforms} onChange={v => setTargeting(t => ({ ...t, target_platforms: v }))} color="#F5A623" />
            </div>
          </section>

          <button type="submit" disabled={saving} style={{ background: saving ? "#333" : "linear-gradient(135deg, #F5A623, #d89420)", color: "#000", border: "none", borderRadius: 12, padding: "16px", fontWeight: 800, fontSize: 16, cursor: saving ? "not-allowed" : "pointer", boxShadow: saving ? "none" : "0 6px 20px rgba(245,166,35,0.35)" }}>
            {saving ? "Submitting..." : "Submit Task for Review →"}
          </button>
        </form>
      </main>
    </div>
  );
}
