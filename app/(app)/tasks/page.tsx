"use client";
import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import TaskCard, { Task } from "@/components/TaskCard";
import TaskModal, { FullTask } from "@/components/TaskModal";
import { useAuth } from "@/lib/useAuth";

const filters = ["All", "Social Media", "Survey", "App Testing", "Content"];

export default function TasksPage() {
  const { user, loading } = useAuth();
  const [tasks, setTasks] = useState<FullTask[]>([]);
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [active, setActive] = useState("All");
  const [selectedTask, setSelectedTask] = useState<FullTask | null>(null);

  const loadTasks = () => {
    setFetching(true); setFetchError(false);
    fetch("/api/tasks")
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(d => { if (d?.tasks) setTasks(d.tasks); })
      .catch(() => setFetchError(true))
      .finally(() => setFetching(false));
  };

  useEffect(() => { if (!user) return; loadTasks(); }, [user]);

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
        return { ok: true, reward: data.reward };
      }
      return { ok: false, error: data.error || "Submission failed" };
    } catch {
      return { ok: false, error: "Network error. Please try again." };
    }
  };

  if (loading || fetching) return <LoadingScreen />;

  if (fetchError) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#000000", flexDirection: "column", gap: 16, padding: 24 }}>
      <p style={{ fontSize: 40 }}>😕</p>
      <p style={{ fontWeight: 700, color: "#F5F5F5", fontSize: 16 }}>Couldn&apos;t load tasks</p>
      <p style={{ color: "#555555", fontSize: 13, textAlign: "center" }}>Check your connection and try again.</p>
      <button onClick={loadTasks} style={{ background: "linear-gradient(135deg, #1AEF22, #06B517)", color: "#000", border: "none", borderRadius: 12, padding: "12px 28px", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
        Retry
      </button>
    </div>
  );

  const filtered = tasks.filter(t => active === "All" || t.category === active);
  const completedCount = tasks.filter(t => t.completed).length;
  const remainingReward = tasks.filter(t => !t.completed).reduce((s, t) => s + t.reward, 0);

  return (
    <div className="page-body" style={{ background: "#000000", minHeight: "100vh" }}>
      {/* Header */}
      <div className="page-header" style={{ background: "#0a0a0a", borderBottom: "1px solid #222222", padding: "52px 20px 28px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -50, right: -50, width: 180, height: 180, borderRadius: "50%", background: "rgba(26,239,34,0.03)" }} />
        <p style={{ color: "#555555", fontSize: 13, marginBottom: 4 }}>Available to earn</p>
        <p style={{ color: "#F5F5F5", fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>Browse Tasks</p>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.2)", borderRadius: 20, padding: "6px 16px", marginTop: 12 }}>
          <span style={{ fontSize: 14 }}>💰</span>
          <span style={{ color: "#F5A623", fontSize: 13, fontWeight: 700 }}>Earn up to {remainingReward.toLocaleString()} QLT today</span>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, padding: "16px", overflowX: "auto", background: "#111111", borderBottom: "1px solid #222222" }}>
        {filters.map(f => (
          <button key={f} onClick={() => setActive(f)} style={{
            flexShrink: 0, padding: "8px 18px", borderRadius: 20,
            border: active === f ? "none" : "1.5px solid #333333",
            background: active === f ? "linear-gradient(135deg, #1AEF22, #06B517)" : "#1a1a1a",
            color: active === f ? "#000" : "#888888",
            fontWeight: active === f ? 800 : 500, fontSize: 13, cursor: "pointer",
            boxShadow: active === f ? "0 4px 12px rgba(26,239,34,0.3)" : "none",
          }}>{f}</button>
        ))}
      </div>

      {/* Progress bar */}
      {completedCount > 0 && (
        <div style={{ padding: "14px 16px 0" }}>
          <div style={{ background: "#111111", borderRadius: 14, padding: "14px 16px", border: "1px solid #222222" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#F5F5F5" }}>{completedCount} of {tasks.length} tasks completed</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#1AEF22" }}>{Math.round((completedCount / tasks.length) * 100)}%</p>
            </div>
            <div style={{ height: 6, background: "#222222", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(completedCount / tasks.length) * 100}%`, background: "linear-gradient(90deg, #1AEF22, #F5A623)", borderRadius: 10, transition: "width 0.4s ease" }} />
            </div>
          </div>
        </div>
      )}

      {/* Task list */}
      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 }} className="task-grid">
        {tasks.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 24px", background: "#111111", borderRadius: 16, border: "1px solid #222222" }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>📋</p>
            <p style={{ fontWeight: 700, fontSize: 16, color: "#F5F5F5", marginBottom: 8 }}>No tasks available</p>
            <p style={{ color: "#555555", fontSize: 13 }}>Tasks are being loaded. Please check back shortly.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <p style={{ fontSize: 32 }}>🎉</p>
            <p style={{ color: "#555555", marginTop: 8 }}>All tasks in this category done!</p>
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
        <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
        <p style={{ color: "#1AEF22", fontWeight: 700 }}>Loading tasks...</p>
      </div>
    </div>
  );
}
