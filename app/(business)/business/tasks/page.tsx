"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import BusinessSidebar from "@/components/BusinessSidebar";

interface Task {
  id: number; title: string; category: string; reward: number;
  is_active: boolean; status: string;
  total_completions: number; approved_completions: number; pending_completions: number;
  created_at: string;
}

const STATUS: Record<string, { label: string; color: string; bg: string }> = {
  pending_review: { label: "Pending Review", color: "#F5A623", bg: "rgba(245,166,35,0.1)" },
  active:         { label: "Active",         color: "#1AEF22", bg: "rgba(26,239,34,0.1)" },
  paused:         { label: "Paused",         color: "#888",    bg: "rgba(255,255,255,0.05)" },
};

export default function BusinessTasksPage() {
  const router = useRouter();
  const [business, setBusiness] = useState<{ name: string } | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch("/api/business/tasks").then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.tasks) setTasks(d.tasks); setLoading(false); });
  };

  useEffect(() => {
    fetch("/api/business/me").then(r => { if (!r.ok) { router.push("/business/login"); return null; } return r.json(); })
      .then(d => { if (d?.business) setBusiness(d.business); });
    load();
  }, [router]);

  const handleAction = async (id: number, action: string) => {
    await fetch(`/api/business/tasks/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }) });
    load();
  };

  if (!business) return (
    <div style={{ minHeight: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#444", fontSize: 14 }}>Loading...</p>
    </div>
  );

  const getStatus = (task: Task) => {
    if (task.status === "pending_review") return STATUS.pending_review;
    if (task.is_active) return STATUS.active;
    return STATUS.paused;
  };

  return (
    <>
      <BusinessSidebar name={business.name} />
      <main className="page-body">

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "#F5F5F5", marginBottom: 2 }}>My Tasks</h1>
            <p style={{ fontSize: 13, color: "#555" }}>{tasks.length} campaign{tasks.length !== 1 ? "s" : ""}</p>
          </div>
          <Link href="/business/tasks/new" style={{
            background: "linear-gradient(135deg, #F5A623, #d89420)", color: "#000",
            textDecoration: "none", padding: "10px 18px", borderRadius: 10,
            fontWeight: 800, fontSize: 13, boxShadow: "0 4px 14px rgba(245,166,35,0.25)",
          }}>
            + Create Task
          </Link>
        </div>

        {loading ? (
          <p style={{ color: "#444", fontSize: 14 }}>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <div style={{ background: "#0d0d0d", borderRadius: 18, padding: "48px 24px", textAlign: "center", border: "1px solid #1a1a1a" }}>
            <Image src="/icon-task.png" alt="No tasks" width={48} height={48} style={{ objectFit: "contain", opacity: 0.3, marginBottom: 16 }} />
            <p style={{ fontSize: 16, fontWeight: 700, color: "#F5F5F5", marginBottom: 8 }}>No tasks yet</p>
            <p style={{ fontSize: 13, color: "#555", marginBottom: 24 }}>Create your first task to start reaching your audience.</p>
            <Link href="/business/tasks/new" style={{ background: "linear-gradient(135deg, #F5A623, #d89420)", color: "#000", textDecoration: "none", padding: "12px 24px", borderRadius: 10, fontWeight: 800, fontSize: 14 }}>
              Create First Task →
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {tasks.map(task => {
              const s = getStatus(task);
              return (
                <div key={task.id} style={{ background: "#0d0d0d", borderRadius: 14, padding: "16px", border: "1px solid #1a1a1a" }}>
                  {/* Top row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 15, fontWeight: 700, color: "#F5F5F5", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{task.title}</p>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                        <span style={{ fontSize: 11, color: "#555" }}>{task.category}</span>
                        <span style={{ fontSize: 11, color: "#F5A623", fontWeight: 600 }}>{task.reward.toLocaleString()} QLT</span>
                      </div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 8, background: s.bg, color: s.color, flexShrink: 0 }}>
                      {s.label}
                    </span>
                  </div>

                  {/* Stats row */}
                  <div style={{ display: "flex", gap: 16, marginBottom: 12, flexWrap: "wrap" }}>
                    {[
                      { label: "Submissions", val: task.total_completions },
                      { label: "Approved",    val: task.approved_completions },
                      { label: "Pending",     val: task.pending_completions },
                    ].map(st => (
                      <div key={st.label}>
                        <p style={{ fontSize: 10, color: "#444", marginBottom: 1 }}>{st.label}</p>
                        <p style={{ fontSize: 15, fontWeight: 700, color: "#F5F5F5" }}>{st.val}</p>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 8 }}>
                    <Link href={`/business/tasks/${task.id}`} style={{ flex: 1, padding: "8px", borderRadius: 8, border: "1px solid #222", background: "transparent", color: "#aaa", textDecoration: "none", fontSize: 12, fontWeight: 600, textAlign: "center" }}>
                      View Details →
                    </Link>
                    {task.status !== "pending_review" && (
                      <button onClick={() => handleAction(task.id, task.is_active ? "pause" : "resume")}
                        style={{ flex: 1, padding: "8px", borderRadius: 8, border: "none", background: task.is_active ? "rgba(229,62,62,0.08)" : "rgba(26,239,34,0.08)", color: task.is_active ? "#e53e3e" : "#1AEF22", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                        {task.is_active ? "Pause" : "Resume"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
