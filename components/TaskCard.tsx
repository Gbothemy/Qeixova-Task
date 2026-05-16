"use client";

export interface Task {
  id: number;
  title: string;
  category: string;
  reward: number;
  duration: string;
  icon: string;
  color: string;
  instructions?: string;
  steps?: string[];
  proof_type?: string;
  proof_label?: string;
  total_budget?: number;
  budget_used?: number;
  completed?: boolean;
  mission_type?: string;
  xp_reward?: number;
  difficulty?: string;
  min_level?: number;
  lockedByLevel?: boolean;
  lockedByType?: boolean;
}

interface TaskCardProps {
  task: Task;
  onStart: (task: Task) => void;
}

const MISSION_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  engagement:    { label: "Engagement",    color: "#4a9eff", bg: "rgba(74,158,255,0.12)" },
  participation: { label: "Participation", color: "#F5A623", bg: "rgba(245,166,35,0.12)" },
  premium:       { label: "Premium",       color: "#c084fc", bg: "rgba(192,132,252,0.12)" },
};

export default function TaskCard({ task, onStart }: TaskCardProps) {
  const locked = task.lockedByLevel || task.lockedByType;
  const badge = MISSION_BADGE[task.mission_type ?? "engagement"] ?? MISSION_BADGE.engagement;

  return (
    <div style={{
      background: "#111111",
      borderRadius: 18,
      padding: "16px 18px",
      display: "flex",
      alignItems: "center",
      gap: 14,
      boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
      border: locked ? "1px solid #2a2a2a" : "1px solid #222222",
      opacity: task.completed ? 0.5 : locked ? 0.6 : 1,
      transition: "opacity 0.3s",
      position: "relative",
      overflow: "hidden",
    }}>
      {locked && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.3)", borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
          <div style={{ background: "#1a1a1a", borderRadius: 10, padding: "6px 14px", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 14 }}>🔒</span>
            <span style={{ fontSize: 12, color: "#ccc", fontWeight: 600 }}>Level {task.min_level} required</span>
          </div>
        </div>
      )}

      <div style={{
        width: 52, height: 52, borderRadius: 16,
        background: badge.bg,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 24, flexShrink: 0,
      }}>
        {task.icon || "📋"}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 600, fontSize: 14, color: "#F5F5F5", marginBottom: 5, lineHeight: 1.3 }}>
          {task.title}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: badge.color, background: badge.bg, borderRadius: 6, padding: "2px 8px" }}>
            {badge.label}
          </span>
          <span style={{ fontSize: 10, fontWeight: 600, color: "#bbb", background: "#1a1a1a", borderRadius: 6, padding: "2px 8px" }}>
            {task.category}
          </span>
          <span style={{ fontSize: 11, color: "#bbbbbb" }}>⏱ {task.duration}</span>
        </div>
        {task.total_budget && task.total_budget > 0 && (
          <div style={{ marginTop: 6 }}>
            <div style={{ height: 3, background: "#222222", borderRadius: 2, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${Math.min(100, ((task.budget_used ?? 0) / task.total_budget) * 100)}%`,
                background: (task.budget_used ?? 0) / task.total_budget > 0.8 ? "#F5A623" : "#1AEF22",
                borderRadius: 2,
              }} />
            </div>
          </div>
        )}
      </div>

      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <p style={{ fontWeight: 800, fontSize: 15, color: "#1AEF22", marginBottom: 2 }}>
          +{task.reward.toLocaleString()} QLT
        </p>
        <p style={{ fontSize: 10, color: "#F5A623", fontWeight: 600, marginBottom: 6 }}>
          +{task.xp_reward ?? 0} QLT boost
        </p>
        {task.completed ? (
          <div style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(26,239,34,0.12)", borderRadius: 8, padding: "5px 10px" }}>
            <span style={{ fontSize: 12 }}>✓</span>
            <span style={{ fontSize: 11, color: "#1AEF22", fontWeight: 700 }}>Done</span>
          </div>
        ) : !locked ? (
          <button onClick={() => onStart(task)} style={{
            background: "linear-gradient(135deg, #1AEF22, #06B517)",
            color: "#000", border: "none", borderRadius: 10,
            padding: "7px 16px", fontSize: 12, fontWeight: 800,
            cursor: "pointer", boxShadow: "0 4px 12px rgba(26,239,34,0.3)",
          }}>
            Start
          </button>
        ) : null}
      </div>
    </div>
  );
}
