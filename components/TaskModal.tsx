"use client";
import { useState, useRef } from "react";

export interface FullTask {
  id: number;
  title: string;
  category: string;
  reward: number;
  duration: string;
  icon: string;
  color: string;
  instructions: string;
  steps: string[];
  proof_type: "screenshot" | "url" | "text" | "none";
  proof_label: string;
  max_screenshots: number;
  total_budget: number;
  budget_used: number;
  task_link: string;
  completed: boolean;
}

interface Props {
  task: FullTask;
  onClose: () => void;
  onComplete: (id: number, proofValue: string) => Promise<{ ok: boolean; error?: string }>;
}

// Renders text with any URLs turned into clickable links
function StepText({ text }: { text: string }) {
  const URL_RE = /(https?:\/\/[^\s]+|(?:www\.|(?:youtube|facebook|tiktok|instagram|x|twitter)\.com)[^\s]*)/gi;
  const parts = text.split(URL_RE);
  return (
    <span>
      {parts.map((part, i) => {
        if (URL_RE.test(part) || /^(www\.|(?:youtube|facebook|tiktok|instagram|x|twitter)\.com)/.test(part)) {
          const href = part.startsWith("http") ? part : `https://${part}`;
          return (
            <a key={i} href={href} target="_blank" rel="noopener noreferrer"
              style={{ color: "#1AEF22", fontWeight: 600, textDecoration: "underline", wordBreak: "break-all" }}>
              {part}
            </a>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}

export default function TaskModal({ task, onClose, onComplete }: Props) {
  const [phase, setPhase] = useState<"details" | "proof" | "success">("details");
  const [proofValue, setProofValue] = useState("");
  const [screenshots, setScreenshots] = useState<{ dataUrl: string; name: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const maxShots = task.max_screenshots ?? 1;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setScreenshots((prev) => {
          if (prev.length >= maxShots) return prev;
          return [...prev, { dataUrl: reader.result as string, name: file.name }];
        });
      };
      reader.readAsDataURL(file);
    });
    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  const removeScreenshot = (idx: number) => {
    setScreenshots((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    let finalProof = proofValue;

    if (task.proof_type === "screenshot") {
      if (screenshots.length < maxShots) {
        setError(`Please upload ${maxShots} screenshot${maxShots > 1 ? "s" : ""} before submitting.`);
        return;
      }
      // Store count marker — actual images not stored in DB
      finalProof = screenshots.length === 1
        ? "[screenshot uploaded]"
        : `[${screenshots.length} screenshots uploaded]`;
    } else if (task.proof_type !== "none" && !proofValue.trim()) {
      setError("Please provide proof of completion before submitting.");
      return;
    }

    setError("");
    setSubmitting(true);
    const result = await onComplete(task.id, finalProof);
    setSubmitting(false);
    if (result.ok) {
      setPhase("success");
    } else {
      setError(result.error || "Submission failed. Please try again.");
    }
  };

  return (
    /* Backdrop */
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,0.55)",
        display: "flex", alignItems: "flex-end", justifyContent: "center",
        backdropFilter: "blur(3px)",
      }}
    >
      {/* Sheet */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "24px 24px 0 0",
          width: "100%", maxWidth: 480,
          maxHeight: "92vh",
          overflowY: "auto",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.2)",
          animation: "slideUp 0.25s ease",
        }}
      >
        <style>{`
          @keyframes slideUp {
            from { transform: translateY(100%); opacity: 0; }
            to   { transform: translateY(0);    opacity: 1; }
          }
        `}</style>

        {/* Handle bar */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: "#e0e0e0" }} />
        </div>

        {/* ── SUCCESS PHASE ── */}
        {phase === "success" && (
          <div style={{ padding: "32px 24px 40px", textAlign: "center" }}>
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              background: "linear-gradient(135deg, #F5A623, #d89420)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 36, margin: "0 auto 20px",
              boxShadow: "0 8px 24px rgba(245,166,35,0.35)",
            }}>⏳</div>
            <h2 style={{ fontWeight: 900, fontSize: 22, color: "#1A1A1A", marginBottom: 8 }}>
              Submission Received!
            </h2>
            <p style={{ color: "#6b6b6b", fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
              Your proof has been submitted for review. QLT will be credited to your balance once verified.
            </p>
            <div style={{
              background: "#fff8e1",
              border: "1px solid rgba(245,166,35,0.3)",
              borderRadius: 16, padding: "20px",
              marginBottom: 16,
            }}>
              <p style={{ fontSize: 13, color: "#e67e22", marginBottom: 4, fontWeight: 600 }}>Pending QLT</p>
              <p style={{ fontSize: 36, fontWeight: 900, color: "#F5A623", letterSpacing: -1 }}>
                +{task.reward.toLocaleString()} QLT
              </p>
              <p style={{ fontSize: 12, color: "#6b6b6b", marginTop: 4 }}>≈ ₦{(task.reward / 100).toFixed(2)} • Awaiting review</p>
            </div>
            <div style={{ background: "#f5f5f5", borderRadius: 12, padding: "12px 16px", marginBottom: 24, textAlign: "left" }}>
              <p style={{ fontSize: 12, color: "#555", lineHeight: 1.7 }}>
                All tasks are verified before listing. Your earnings are tracked transparently and the conversion rate is fixed at <strong>100 QLT = ₦1</strong>.
              </p>
            </div>
            <button onClick={onClose} style={{
              width: "100%", background: "linear-gradient(135deg, #1AEF22, #06B517)",
              color: "#fff", border: "none", borderRadius: 14, padding: "15px",
              fontWeight: 800, fontSize: 15, cursor: "pointer",
              boxShadow: "0 6px 20px rgba(26,239,34,0.3)",
            }}>
              Complete Another Task
            </button>
          </div>
        )}

        {/* ── DETAILS PHASE ── */}
        {phase === "details" && (
          <div style={{ padding: "20px 24px 32px" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 20 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16, background: task.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 26, flexShrink: 0,
              }}>
                {task.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontWeight: 800, fontSize: 17, color: "#1A1A1A", lineHeight: 1.3, marginBottom: 6 }}>
                  {task.title}
                </h2>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#1AEF22", background: "#e8ffe9", borderRadius: 6, padding: "2px 8px" }}>
                    {task.category}
                  </span>
                  <span style={{ fontSize: 11, color: "#a0a0a0" }}>⏱ {task.duration}</span>
                </div>
              </div>
              <button onClick={onClose} style={{
                background: "#F5F5F5", border: "none", borderRadius: 10,
                width: 32, height: 32, cursor: "pointer", fontSize: 16,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>✕</button>
            </div>

            {/* Reward banner */}
            <div style={{
              background: "linear-gradient(135deg, #1AEF22, #06B517)",
              borderRadius: 14, padding: "14px 18px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: 22, position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(245,166,35,0.12)" }} />
              <div>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, marginBottom: 2 }}>You will earn</p>
                <p style={{ color: "#F5A623", fontWeight: 900, fontSize: 22, letterSpacing: -0.5 }}>
                  ⭐ {task.reward.toLocaleString()} QLT
                </p>
                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 11, marginTop: 2 }}>≈ ₦{(task.reward / 100).toFixed(2)}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, marginBottom: 2 }}>Duration</p>
                <p style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>{task.duration}</p>
              </div>
            </div>

            {/* Instructions */}
            <div style={{ marginBottom: 22 }}>
              <p style={{ fontWeight: 700, fontSize: 14, color: "#1A1A1A", marginBottom: 8 }}>About this task</p>
              <p style={{ fontSize: 13, color: "#6b6b6b", lineHeight: 1.7 }}>{task.instructions}</p>
            </div>

            {/* Steps */}
            {task.steps?.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <p style={{ fontWeight: 700, fontSize: 14, color: "#1A1A1A", marginBottom: 12 }}>
                  Step-by-step instructions
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {task.steps.map((step, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <div style={{
                        width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                        background: "linear-gradient(135deg, #1AEF22, #06B517)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontSize: 11, fontWeight: 800,
                      }}>
                        {i + 1}
                      </div>
                      <p style={{ fontSize: 13, color: "#3a3a3a", lineHeight: 1.6, paddingTop: 3 }}>
                        <StepText text={step} />
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Proof type hint */}
            {task.proof_type !== "none" && (
              <div style={{
                background: "#fdf8e1", border: "1px solid #f0e0a0",
                borderRadius: 12, padding: "12px 14px", marginBottom: 24,
                display: "flex", gap: 10, alignItems: "flex-start",
              }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>
                  {task.proof_type === "screenshot" ? "📸" : task.proof_type === "url" ? "🔗" : "✏️"}
                </span>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#d89420", marginBottom: 2 }}>
                    {task.proof_type === "screenshot" && maxShots > 1
                      ? `${maxShots} screenshots required`
                      : "Proof required"}
                  </p>
                  <p style={{ fontSize: 12, color: "#8a6a1e" }}>{task.proof_label}</p>
                </div>
              </div>
            )}

            {/* Go to Task button — shown when a direct link is set */}
            {task.task_link && (
              <a
                href={task.task_link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  width: "100%", padding: "14px",
                  background: "linear-gradient(135deg, #1a73e8, #1557b0)",
                  color: "#fff", textDecoration: "none",
                  borderRadius: 14, fontWeight: 700, fontSize: 15,
                  boxShadow: "0 6px 20px rgba(26,115,232,0.3)",
                  marginBottom: 12,
                }}
              >
                <span style={{ fontSize: 18 }}>🔗</span>
                Go to Task →
              </a>
            )}

            <button onClick={() => setPhase("proof")} style={{
              width: "100%",
              background: "linear-gradient(135deg, #F5A623, #d89420)",
              color: "#fff", border: "none", borderRadius: 14, padding: "16px",
              fontWeight: 800, fontSize: 16, cursor: "pointer",
              boxShadow: "0 6px 20px rgba(245,166,35,0.35)",
            }}>
              I&apos;m Ready — Start Task →
            </button>
          </div>
        )}

        {/* ── PROOF PHASE ── */}
        {phase === "proof" && (
          <div style={{ padding: "20px 24px 36px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <button onClick={() => setPhase("details")} style={{
                background: "#F5F5F5", border: "none", borderRadius: 10,
                width: 36, height: 36, cursor: "pointer", fontSize: 18,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>←</button>
              <div>
                <h2 style={{ fontWeight: 800, fontSize: 17, color: "#1A1A1A" }}>Submit Proof</h2>
                <p style={{ fontSize: 12, color: "#a0a0a0" }}>{task.title}</p>
              </div>
            </div>

            {/* Checklist reminder */}
            <div style={{
              background: "#fafafa", border: "1px solid #e0e0e0",
              borderRadius: 14, padding: "14px 16px", marginBottom: 22,
            }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#1AEF22", marginBottom: 10 }}>
                ✅ Completion checklist
              </p>
              {task.steps?.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: "#1AEF22", flexShrink: 0, marginTop: 1 }}>✓</span>
                  <p style={{ fontSize: 12, color: "#6b6b6b", lineHeight: 1.5 }}>
                    <StepText text={step} />
                  </p>
                </div>
              ))}
            </div>

            {/* Proof input */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#6b6b6b", letterSpacing: 0.5, display: "block", marginBottom: 10 }}>
                {task.proof_label.toUpperCase()}
              </label>

              {task.proof_type === "screenshot" && (
                <div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    multiple={maxShots > 1}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />

                  {/* Screenshot slots grid */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: maxShots === 1 ? "1fr" : "1fr 1fr",
                    gap: 10,
                  }}>
                    {/* Uploaded previews */}
                    {screenshots.map((s, idx) => (
                      <div key={idx} style={{ position: "relative" }}>
                        <img
                          src={s.dataUrl}
                          alt={`proof ${idx + 1}`}
                          style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 12, border: "2px solid #1AEF22" }}
                        />
                        <button
                          onClick={() => removeScreenshot(idx)}
                          style={{
                            position: "absolute", top: 6, right: 6,
                            width: 24, height: 24, borderRadius: "50%",
                            background: "rgba(0,0,0,0.6)", border: "none",
                            color: "#fff", fontSize: 14, cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}
                        >✕</button>
                        <p style={{ fontSize: 10, color: "#1AEF22", textAlign: "center", marginTop: 4, fontWeight: 600 }}>
                          ✓ Screenshot {idx + 1}
                        </p>
                      </div>
                    ))}

                    {/* Empty slots */}
                    {Array.from({ length: maxShots - screenshots.length }).map((_, idx) => (
                      <div
                        key={`empty-${idx}`}
                        onClick={() => fileRef.current?.click()}
                        style={{
                          border: "2px dashed #e0e0e0",
                          borderRadius: 12, height: 120,
                          display: "flex", flexDirection: "column",
                          alignItems: "center", justifyContent: "center",
                          cursor: "pointer", background: "#fafafa",
                          gap: 6,
                        }}
                      >
                        <span style={{ fontSize: 28 }}>📸</span>
                        <p style={{ fontSize: 11, color: "#a0a0a0", textAlign: "center" }}>
                          {screenshots.length === 0 && idx === 0
                            ? maxShots > 1 ? `Upload ${maxShots} screenshots` : "Tap to upload"
                            : `Screenshot ${screenshots.length + idx + 1}`}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Progress indicator */}
                  <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1, height: 4, background: "#F5F5F5", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{
                        height: "100%",
                        width: `${(screenshots.length / maxShots) * 100}%`,
                        background: screenshots.length === maxShots ? "#1AEF22" : "#F5A623",
                        borderRadius: 4, transition: "width 0.3s",
                      }} />
                    </div>
                    <p style={{ fontSize: 11, color: "#6b6b6b", flexShrink: 0 }}>
                      {screenshots.length}/{maxShots} uploaded
                    </p>
                  </div>
                  <p style={{ fontSize: 11, color: "#a0a0a0", marginTop: 6 }}>
                    PNG, JPG or WEBP · Max 5MB each
                  </p>
                </div>
              )}

              {task.proof_type === "url" && (
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>🔗</span>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={proofValue}
                    onChange={(e) => setProofValue(e.target.value)}
                    style={{
                      width: "100%", padding: "14px 14px 14px 42px",
                      borderRadius: 12, border: "1.5px solid #e0e0e0",
                      fontSize: 14, outline: "none", color: "#1A1A1A", background: "#fafafa",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#1AEF22")}
                    onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
                  />
                </div>
              )}

              {task.proof_type === "text" && (
                <textarea
                  placeholder="Enter your proof here..."
                  value={proofValue}
                  onChange={(e) => setProofValue(e.target.value)}
                  rows={4}
                  style={{
                    width: "100%", padding: "14px",
                    borderRadius: 12, border: "1.5px solid #e0e0e0",
                    fontSize: 14, outline: "none", color: "#1A1A1A",
                    background: "#fafafa", resize: "vertical", lineHeight: 1.6,
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#1AEF22")}
                  onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
                />
              )}
            </div>

            {error && (
              <div style={{
                background: "#fff5f5", border: "1px solid #fed7d7",
                borderRadius: 10, padding: "11px 14px", marginBottom: 16,
                fontSize: 13, color: "#e53e3e",
              }}>
                ⚠️ {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                width: "100%",
                background: submitting ? "#a0a0a0" : "linear-gradient(135deg, #1AEF22, #06B517)",
                color: "#fff", border: "none", borderRadius: 14, padding: "16px",
                fontWeight: 800, fontSize: 15,
                cursor: submitting ? "not-allowed" : "pointer",
                boxShadow: submitting ? "none" : "0 6px 20px rgba(26,239,34,0.3)",
              }}
            >
              {submitting ? "Submitting..." : `Submit & Claim ${task.reward.toLocaleString()} QLT`}
            </button>

            <p style={{ fontSize: 11, color: "#a0a0a0", textAlign: "center", marginTop: 12, lineHeight: 1.5 }}>
              Rewards are credited after proof review · Usually instant
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
