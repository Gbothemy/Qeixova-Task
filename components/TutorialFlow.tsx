"use client";
import { useState } from "react";
import Image from "next/image";

interface Props {
  onComplete: () => void;
}

const STEPS = [
  {
    icon: "/icon-task.svg",
    tag: "Step 1 of 5",
    title: "Browse Available Tasks",
    body: "Go to the Tasks tab to see all available tasks. Tasks are grouped by category — Social Media, Surveys, App Testing, and AI Testing.",
    tip: "New tasks are added daily. Check back regularly.",
    screen: "tasks",
  },
  {
    icon: "/icon-task.svg",
    tag: "Step 2 of 5",
    title: "Pick a Task",
    body: "Tap any task to see the full instructions, reward amount, and estimated time. Read everything carefully before starting.",
    tip: "Start with shorter tasks to get approved faster.",
    screen: "task-detail",
  },
  {
    icon: "/icon-task.svg",
    tag: "Step 3 of 5",
    title: "Complete & Submit Proof",
    body: "Follow the step-by-step instructions exactly. When done, submit your proof — a screenshot, URL, or confirmation code depending on the task.",
    tip: "Make sure your proof clearly shows the task was completed.",
    screen: "proof",
  },
  {
    icon: "/icon-wallet.svg",
    tag: "Step 4 of 5",
    title: "Wait for Approval",
    body: "Your submission goes to review. Once approved, QLT is credited to your balance instantly. You can track pending submissions in your Wallet.",
    tip: "All tasks are verified before listing. Approvals are fair and transparent.",
    screen: "wallet",
  },
  {
    icon: "/icon-wallet.svg",
    tag: "Step 5 of 5",
    title: "Convert & Withdraw",
    body: "When you're ready, go to your Wallet and convert your QLT to Naira. Minimum withdrawal is 100,000 QLT (₦1,000). Processed within 24 hours.",
    tip: "100 QLT = ₦1. The rate is fixed and transparent.",
    screen: "withdraw",
  },
];

export default function TutorialFlow({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  if (showPrompt) {
    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "#000000",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
      }}>
        <div style={{ maxWidth: 400, width: "100%", textAlign: "center" }}>
          {/* Success icon */}
          <div style={{
            width: 88, height: 88, borderRadius: "50%",
            background: "linear-gradient(135deg, #1AEF22, #06B517)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px",
            boxShadow: "0 8px 28px rgba(26,239,34,0.35)",
            fontSize: 40,
          }}>
            🎯
          </div>

          <h2 style={{ fontSize: 26, fontWeight: 900, color: "#F5F5F5", letterSpacing: -1, marginBottom: 12 }}>
            You&apos;re ready to earn!
          </h2>
          <p style={{ fontSize: 15, color: "#b0b0b0", lineHeight: 1.7, marginBottom: 32 }}>
            You know how it works. Now complete your first task and earn your first QLT.
          </p>

          {/* Trust line */}
          <div style={{ background: "#111111", borderRadius: 14, padding: "14px 18px", marginBottom: 28, border: "1px solid #222222" }}>
            {[
              "All tasks are verified before listing",
              "Your earnings are tracked transparently",
              "100 QLT = ₦1 — fixed rate, always",
            ].map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i < 2 ? 10 : 0 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#1AEF22", flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: "#b0b0b0" }}>{t}</p>
              </div>
            ))}
          </div>

          <button onClick={onComplete} style={{
            width: "100%", background: "linear-gradient(135deg, #F5A623, #d89420)",
            color: "#000", border: "none", borderRadius: 14, padding: "17px",
            fontWeight: 800, fontSize: 16, cursor: "pointer",
            boxShadow: "0 6px 20px rgba(245,166,35,0.4)",
            marginBottom: 12,
          }}>
            Complete My First Task →
          </button>

          <button onClick={onComplete} style={{
            width: "100%", background: "transparent", border: "none",
            color: "#bbbbbb", fontSize: 13, cursor: "pointer", padding: "8px",
          }}>
            Go to dashboard instead
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#000000",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }}>
      <div style={{ maxWidth: 420, width: "100%" }}>

        {/* Progress bar */}
        <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 4, borderRadius: 4,
              background: i <= step ? "#1AEF22" : "#222222",
              transition: "background 0.3s",
            }} />
          ))}
        </div>

        {/* Intro notice — only on first step */}
        {step === 0 && (
          <div style={{ background: "rgba(26,239,34,0.06)", border: "1px solid rgba(26,239,34,0.15)", borderRadius: 12, padding: "10px 14px", marginBottom: 20, display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#1AEF22", flexShrink: 0 }} />
            <p style={{ fontSize: 12, color: "#1AEF22", fontWeight: 600 }}>Quick tutorial — 5 steps, takes under a minute</p>
          </div>
        )}
        <p style={{ fontSize: 11, fontWeight: 700, color: "#1AEF22", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 20 }}>
          {current.tag}
        </p>

        {/* Card */}
        <div style={{ background: "#111111", borderRadius: 24, padding: "32px 28px", border: "1px solid #222222", marginBottom: 20 }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, background: "rgba(26,239,34,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 22 }}>
            <Image src={current.icon} alt="" width={34} height={34} style={{ objectFit: "contain" }} />
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#F5F5F5", marginBottom: 12, letterSpacing: -0.5 }}>
            {current.title}
          </h2>
          <p style={{ fontSize: 15, color: "#b0b0b0", lineHeight: 1.75, marginBottom: 20 }}>
            {current.body}
          </p>

          {/* Tip */}
          <div style={{ background: "rgba(245,166,35,0.06)", border: "1px solid rgba(245,166,35,0.15)", borderRadius: 10, padding: "10px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>💡</span>
            <p style={{ fontSize: 12, color: "#F5A623", lineHeight: 1.6 }}>{current.tip}</p>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", gap: 12 }}>
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} style={{
              flex: 1, padding: "14px", borderRadius: 12,
              border: "1.5px solid #333333", background: "transparent",
              color: "#cccccc", fontWeight: 600, fontSize: 15, cursor: "pointer",
            }}>
              ← Back
            </button>
          )}
          <button onClick={() => {
            if (isLast) setShowPrompt(true);
            else setStep(s => s + 1);
          }} style={{
            flex: 2, padding: "14px", borderRadius: 12, border: "none",
            background: isLast ? "linear-gradient(135deg, #F5A623, #d89420)" : "linear-gradient(135deg, #1AEF22, #06B517)",
            color: "#000", fontWeight: 800, fontSize: 15, cursor: "pointer",
            boxShadow: isLast ? "0 6px 20px rgba(245,166,35,0.35)" : "0 6px 20px rgba(26,239,34,0.25)",
          }}>
            {isLast ? "I'm ready →" : "Next →"}
          </button>
        </div>

        {/* Skip */}
        <button onClick={() => setShowPrompt(true)} style={{
          width: "100%", marginTop: 14, background: "transparent",
          border: "none", color: "#aaaaaa", fontSize: 12, cursor: "pointer", padding: "6px",
        }}>
          Skip tutorial
        </button>
      </div>
    </div>
  );
}
