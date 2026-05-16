"use client";
import { useCallback, useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import TaskCard, { Task } from "@/components/TaskCard";
import TaskModal, { FullTask } from "@/components/TaskModal";
import { useAuth } from "@/lib/useAuth";

type MissionCategoryFilter = {
  val: string;
  label: string;
  accent: string;
  aliases?: string[];
};

const topCategoryFilters: MissionCategoryFilter[] = [
  { val: "All", label: "All Opportunities", accent: "#1AEF22" },
  { val: "Content Distribution", label: "Content Distribution", accent: "#4a9eff", aliases: ["Social Media", "Content"] },
  { val: "Music Promotion", label: "Music Promotion", accent: "#F5A623" },
  { val: "Business Awareness", label: "Business Awareness", accent: "#1AEF22" },
  { val: "Creator Campaigns", label: "Creator Campaigns", accent: "#c084fc", aliases: ["Creator Campaign"] },
  { val: "App Testing", label: "App Testing", accent: "#14b8a6", aliases: ["App Testing & Reviews"] },
  { val: "Referral Missions", label: "Referral Missions", accent: "#f87171", aliases: ["Referral Mission"] },
];

const moreCategoryFilters: MissionCategoryFilter[] = [
  { val: "Surveys & Feedback", label: "Surveys & Feedback", accent: "#fb7185", aliases: ["Survey", "Surveys"] },
  { val: "Event Promotion", label: "Event Promotion", accent: "#f97316" },
  { val: "Community Growth", label: "Community Growth", accent: "#22c55e" },
  { val: "Video Engagement", label: "Video Engagement", accent: "#e879f9" },
  { val: "Brand Ambassador Missions", label: "Brand Ambassador", accent: "#60a5fa" },
  { val: "AI & Digital Work", label: "AI & Digital Work", accent: "#38bdf8", aliases: ["AI Testing"] },
  { val: "Local Discovery Missions", label: "Local Discovery", accent: "#10b981" },
  { val: "Trend Missions", label: "Trend Missions", accent: "#fb7185" },
  { val: "Premium Missions", label: "Premium Missions", accent: "#facc15", aliases: ["Premium Mission"] },
];

interface Meta { userLevel: number; levelName: string; badgeColor: string; xp: number; dailyEarned: number; dailyCap: number; dailyRemaining: number; trustScore: number; }

const allCategoryFilters = [...topCategoryFilters, ...moreCategoryFilters];

function normalizeCategory(category: string) {
  const normalized = category.trim().toLowerCase();
  const match = allCategoryFilters.find((filter) => {
    if (filter.val.toLowerCase() === normalized || filter.label.toLowerCase() === normalized) return true;
    return filter.aliases?.some((alias) => alias.toLowerCase() === normalized);
  });
  return match?.val ?? category;
}

export default function TasksPage() {
  const { user, loading } = useAuth();
  const [tasks, setTasks] = useState<FullTask[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [selectedTask, setSelectedTask] = useState<FullTask | null>(null);

  const loadTasks = useCallback(() => {
    setFetching(true); setFetchError(false);
    fetch("/api/tasks")
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(d => { if (d?.tasks) setTasks(d.tasks); if (d?.meta) setMeta(d.meta); })
      .catch(() => setFetchError(true))
      .finally(() => setFetching(false));
  }, []);

  useEffect(() => {
    if (!user) return;
    void Promise.resolve().then(loadTasks);
  }, [user, loadTasks]);

  const handleComplete = async (id: number, proofValue: string) => {
    try {
      const res = await fetch("/api/tasks/complete", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId: id, proofValue }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: true } : t));
        window.dispatchEvent(new CustomEvent("balanceUpdated", { detail: { newBalance: data.newBalance } }));
        return { ok: true, reward: data.reward, xpReward: data.xpReward };
      }
      return { ok: false, error: data.error || "Submission failed" };
    } catch {
      return { ok: false, error: "Network error. Please try again." };
    }
  };

  if (loading || fetching) return <LoadingScreen />;

  if (fetchError) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#000000", flexDirection: "column", gap: 16, padding: 24 }}>
      <img src="/icon-alert.svg" width={48} height={48} style={{ opacity:0.5, filter:"invert(40%) sepia(100%) saturate(500%) hue-rotate(320deg)" }} alt="" />
      <p style={{ fontWeight: 700, color: "#F5F5F5", fontSize: 16 }}>Couldn&apos;t load missions</p>
      <button onClick={loadTasks} style={{ background: "linear-gradient(135deg, #1AEF22, #06B517)", color: "#000", border: "none", borderRadius: 12, padding: "12px 28px", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>Retry</button>
    </div>
  );

  const filtered = tasks.filter((task) => {
    if (activeCategory === "All") return true;
    return normalizeCategory(task.category) === activeCategory;
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const dailyPct = meta ? Math.min(100, (meta.dailyEarned / meta.dailyCap) * 100) : 0;
  const activeLabel = allCategoryFilters.find((filter) => filter.val === activeCategory)?.label ?? activeCategory;

  return (
    <div className="page-body" style={{ background: "#000000", minHeight: "100vh" }}>
      {/* Header */}
      <div className="page-header" style={{ background: "#0a0a0a", borderBottom: "1px solid #222222", padding: "52px 20px 20px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -50, right: -50, width: 180, height: 180, borderRadius: "50%", background: "rgba(26,239,34,0.03)" }} />
        <p style={{ color: "#bbbbbb", fontSize: 13, marginBottom: 4 }}>Participation Missions</p>
        <p style={{ color: "#F5F5F5", fontSize: 24, fontWeight: 800, letterSpacing: -0.5 }}>Missions</p>
        <p style={{ color: "#aaaaaa", fontSize: 13, marginTop: 6, lineHeight: 1.5, maxWidth: 460 }}>Choose a contribution channel and join campaigns that match how you want to participate.</p>

        {/* Level + daily cap bar */}
        {meta && (
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: (meta.badgeColor ?? "#ccc") + "22", color: meta.badgeColor ?? "#ccc" }}>
                L{meta.userLevel} {meta.levelName}
              </span>
              <span style={{ fontSize: 11, color: "#F5A623", fontWeight: 600 }}>⭐ {meta.xp.toLocaleString()} XP</span>
              <span style={{ fontSize: 11, color: "#bbb" }}>Trust: {meta.trustScore}%</span>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: "#bbb" }}>Daily cap</span>
                <span style={{ fontSize: 11, color: dailyPct >= 90 ? "#e53e3e" : "#F5A623", fontWeight: 600 }}>
                  {meta.dailyEarned.toLocaleString()} / {meta.dailyCap.toLocaleString()} QLT
                </span>
              </div>
              <div style={{ height: 4, background: "#1a1a1a", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${dailyPct}%`, background: dailyPct >= 90 ? "#e53e3e" : "linear-gradient(90deg, #1AEF22, #F5A623)", borderRadius: 4, transition: "width 0.4s" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mission category filters */}
      <div style={{ padding: "14px 16px", background: "#111111", borderBottom: "1px solid #222222" }}>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8 }}>
          {topCategoryFilters.map((filter) => {
            const active = activeCategory === filter.val;
            return (
              <button key={filter.val} onClick={() => setActiveCategory(filter.val)} style={{
                flexShrink: 0, padding: "8px 14px", borderRadius: 20,
                border: active ? "none" : "1.5px solid #333333",
                background: active ? filter.accent : "#1a1a1a",
                color: active ? "#000" : "#cccccc",
                fontWeight: active ? 800 : 600, fontSize: 12, cursor: "pointer",
              }}>{filter.label}</button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setShowMoreCategories((open) => !open)}
          style={{ width: "100%", border: "1px solid #242424", borderRadius: 12, background: "#0a0a0a", color: "#F5F5F5", padding: "10px 12px", fontSize: 12, fontWeight: 800, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <span>{showMoreCategories ? "Hide more categories" : "Explore more categories"}</span>
          <span style={{ color: "#1AEF22", fontSize: 16 }}>{showMoreCategories ? "-" : "+"}</span>
        </button>
        {showMoreCategories && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
            {moreCategoryFilters.map((filter) => {
              const active = activeCategory === filter.val;
              return (
                <button key={filter.val} onClick={() => setActiveCategory(filter.val)} style={{
                  padding: "8px 12px", borderRadius: 12,
                  border: active ? "none" : "1px solid #303030",
                  background: active ? filter.accent : "#171717",
                  color: active ? "#000" : "#cccccc",
                  fontWeight: 800, fontSize: 12, cursor: "pointer",
                }}>{filter.label}</button>
              );
            })}
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginTop: 12 }}>
          <p style={{ color: "#bbbbbb", fontSize: 12 }}>
            {filtered.length.toLocaleString()} {activeCategory === "All" ? "available mission" : activeLabel.toLowerCase() + " mission"}{filtered.length === 1 ? "" : "s"}
          </p>
          {activeCategory !== "All" && (
            <button type="button" onClick={() => setActiveCategory("All")} style={{ border: "none", background: "transparent", color: "#1AEF22", fontSize: 12, fontWeight: 800, cursor: "pointer" }}>Clear</button>
          )}
        </div>
      </div>

      {/* Progress */}
      {completedCount > 0 && (
        <div style={{ padding: "12px 16px 0" }}>
          <div style={{ background: "#111111", borderRadius: 12, padding: "12px 16px", border: "1px solid #222222" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#F5F5F5" }}>{completedCount} of {tasks.length} missions completed</p>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#1AEF22" }}>{Math.round((completedCount / tasks.length) * 100)}%</p>
            </div>
            <div style={{ height: 5, background: "#222222", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(completedCount / tasks.length) * 100}%`, background: "linear-gradient(90deg, #1AEF22, #F5A623)", borderRadius: 10 }} />
            </div>
          </div>
        </div>
      )}

      {/* Mission list */}
      <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }} className="task-grid">
        {tasks.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 24px", background: "#111111", borderRadius: 16, border: "1px solid #222222" }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>🎯</p>
            <p style={{ fontWeight: 700, fontSize: 16, color: "#F5F5F5", marginBottom: 8 }}>No missions available</p>
            <p style={{ color: "#bbbbbb", fontSize: 13 }}>New missions are added regularly. Check back soon.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <img src="/icon-check-circle.svg" width={40} height={40} style={{ opacity:0.4, filter:"invert(58%) sepia(98%) saturate(400%) hue-rotate(83deg) brightness(110%)", marginBottom:8 }} alt="" />
            <p style={{ color: "#bbbbbb", marginTop: 8 }}>No open {activeLabel.toLowerCase()} missions right now.</p>
          </div>
        ) : (
          filtered.map(task => (
            <TaskCard key={task.id} task={task as Task} onStart={t => setSelectedTask(t as FullTask)} />
          ))
        )}
      </div>

      {selectedTask && (
        <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} onComplete={handleComplete} />
      )}
      <BottomNav />
    </div>
  );
}

function LoadingScreen() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#000000" }}>
      <div style={{ textAlign: "center" }}>
        <img src="/icon-target.svg" width={48} height={48} style={{ opacity:0.4, filter:"invert(58%) sepia(98%) saturate(400%) hue-rotate(83deg) brightness(110%)", marginBottom:12 }} alt="" />
        <p style={{ color: "#1AEF22", fontWeight: 700 }}>Loading missions...</p>
      </div>
    </div>
  );
}
