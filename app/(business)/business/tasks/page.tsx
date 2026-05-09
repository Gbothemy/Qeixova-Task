"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BusinessSidebar from "@/components/BusinessSidebar";

interface Task { id: number; title: string; category: string; reward: number; is_active: boolean; status: string; total_completions: number; approved_completions: number; pending_completions: number; created_at: string; }

export default function BusinessTasksPage() {
  const router = useRouter();
  const [business, setBusiness] = useState<{ name: string } | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/business/me").then(r => { if (!r.ok) { router.push("/business/login"); return null; } return r.json(); })
      .then(d => { if (d?.business) setBusiness(d.business); });
    fetch("/api/business/tasks").then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.tasks) setTasks(d.tasks); setLoading(false); });
  }, [router]);

  const handleAction = async (id: number, action: string) => {
    await fetch(`/api/business/tasks/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }) });
    fetch("/api/business/tasks").then(r => r.ok ? r.json() : null).then(d => { if (d?.tasks) setTasks(d.tasks); });
  };

  if (!business) return <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: "#888" }}>Loading...</p></div>;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#000000" }}>
      <BusinessSidebar name={business.name} />
      <main style={{ flex: 1, padding: "40px 32px", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#F5F5F5", marginBottom: 4 }}>My Tasks</h1>
            <p style={{ fontSize: 14, color: "#888888" }}>{tasks.length} task{tasks.length !== 1 ? "s" : ""} created</p>
          </div>
          <Link href="/business/tasks/new" style={{ background: "linear-gradient(135deg, #F5A623, #d89420)", color: "#000", textDecoration: "none", padding: "10px 20px", borderRadius: 10, fontWeight: 800, fontSize: 14 }}>
            + Create Task
          </Link>
        </div>

        {loading ? (
          <p style={{ color: "#888" }}>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <div style={{ background: "#111111", borderRadius: 16, padding: "48px", textAlign: "center", border: "1px solid #222222" }}>
            <p style={{ fontSize: 32, marginBottom: 12 }}>📋</p>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#F5F5F5", marginBottom: 8 }}>No tasks yet</p>
            <p style={{ fontSize: 14, color: "#888888", marginBottom: 20 }}>Create your first task to start reaching your audience.</p>
            <Link href="/business/tasks/new" style={{ background: "linear-gradient(135deg, #1AEF22, #06B517)", color: "#000", textDecoration: "none", padding: "12px 24px", borderRadius: 10, fontWeight: 800, fontSize: 14 }}>
              Create First Task →
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {tasks.map(task => (
              <div key={task.id} style={{ background: "#111111", borderRadius: 16, padding: "20px 24px", border: "1px solid #222222", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <p style={{ fontSize: 16, fontWeight: 700, color: "#F5F5F5" }}>{task.title}</p>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6, background: task.status === "pending_review" ? "rgba(245,166,35,0.1)" : task.is_active ? "rgba(26,239,34,0.1)" : "rgba(255,255,255,0.05)", color: task.status === "pending_review" ? "#F5A623" : task.is_active ? "#1AEF22" : "#888888" }}>
                      {task.status === "pending_review" ? "Pending Review" : task.is_active ? "Active" : "Paused"}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 12, color: "#888888" }}>{task.category}</span>
                    <span style={{ fontSize: 12, color: "#F5A623", fontWeight: 600 }}>{task.reward.toLocaleString()} QLT / completion</span>
                    <span style={{ fontSize: 12, color: "#888888" }}>{task.total_completions} submissions · {task.approved_completions} approved · {task.pending_completions} pending</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Link href={`/business/tasks/${task.id}`} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #333333", background: "transparent", color: "#F5F5F5", textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
                    View →
                  </Link>
                  {task.status !== "pending_review" && (
                    <button onClick={() => handleAction(task.id, task.is_active ? "pause" : "resume")}
                      style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: task.is_active ? "rgba(229,62,62,0.1)" : "rgba(26,239,34,0.1)", color: task.is_active ? "#e53e3e" : "#1AEF22", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                      {task.is_active ? "Pause" : "Resume"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
