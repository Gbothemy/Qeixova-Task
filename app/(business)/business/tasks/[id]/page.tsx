"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import BusinessSidebar from "@/components/BusinessSidebar";

interface Completion { id: number; full_name: string; email: string; status: string; completed_at: string; rejection_reason: string | null; }
interface Task { id: number; title: string; category: string; reward: number; is_active: boolean; status: string; total_completions: number; approved_completions: number; pending_completions: number; rejected_completions: number; target_completion_count: number; created_at: string; }

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  pending:  { bg: "rgba(245,166,35,0.1)", color: "#F5A623" },
  approved: { bg: "rgba(26,239,34,0.1)", color: "#1AEF22" },
  rejected: { bg: "rgba(229,62,62,0.1)", color: "#e53e3e" },
};

export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [business, setBusiness] = useState<{ name: string } | null>(null);
  const [task, setTask] = useState<Task | null>(null);
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [actionLoading, setActionLoading] = useState(false);

  const load = () => {
    fetch(`/api/business/tasks/${id}`).then(r => r.ok ? r.json() : null).then(d => {
      if (d) { setTask(d.task); setCompletions(d.completions); }
    });
  };

  useEffect(() => {
    fetch("/api/business/me").then(r => { if (!r.ok) { router.push("/business/login"); return null; } return r.json(); })
      .then(d => { if (d?.business) setBusiness(d.business); });
    load();
  }, [id, router]);

  const handleAction = async (action: string) => {
    setActionLoading(true);
    await fetch(`/api/business/tasks/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }) });
    setActionLoading(false);
    load();
  };

  if (!business || !task) return <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: "#888" }}>Loading...</p></div>;

  const progress = task.target_completion_count > 0 ? Math.min((task.approved_completions / task.target_completion_count) * 100, 100) : 0;

  return (
    <>
      <BusinessSidebar name={business.name} />
      <main className="page-body" style={{ padding: "24px 20px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
          <div>
            <Link href="/business/tasks" style={{ fontSize: 13, color: "#888888", textDecoration: "none", marginBottom: 8, display: "block" }}>← Back to Tasks</Link>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#F5F5F5", marginBottom: 6 }}>{task.title}</h1>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "#888888" }}>{task.category}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#F5A623" }}>{task.reward.toLocaleString()} QLT / completion</span>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6, background: task.status === "pending_review" ? "rgba(245,166,35,0.1)" : task.is_active ? "rgba(26,239,34,0.1)" : "rgba(255,255,255,0.05)", color: task.status === "pending_review" ? "#F5A623" : task.is_active ? "#1AEF22" : "#888888" }}>
                {task.status === "pending_review" ? "Pending Review" : task.is_active ? "Active" : "Paused"}
              </span>
            </div>
          </div>
          {task.status !== "pending_review" && (
            <button onClick={() => handleAction(task.is_active ? "pause" : "resume")} disabled={actionLoading}
              style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: task.is_active ? "rgba(229,62,62,0.1)" : "rgba(26,239,34,0.1)", color: task.is_active ? "#e53e3e" : "#1AEF22", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              {task.is_active ? "Pause Task" : "Resume Task"}
            </button>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
          {[
            { label: "Total Submissions", value: task.total_completions, color: "#4a9eff" },
            { label: "Approved", value: task.approved_completions, color: "#1AEF22" },
            { label: "Pending", value: task.pending_completions, color: "#F5A623" },
            { label: "Rejected", value: task.rejected_completions, color: "#e53e3e" },
          ].map(s => (
            <div key={s.label} style={{ background: "#111111", borderRadius: 12, padding: "16px", border: "1px solid #222222", borderLeft: `3px solid ${s.color}` }}>
              <p style={{ fontSize: 11, color: "#888888", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</p>
              <p style={{ fontSize: 24, fontWeight: 800, color: "#F5F5F5" }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Progress */}
        {task.target_completion_count > 0 && (
          <div style={{ background: "#111111", borderRadius: 14, padding: "16px 18px", border: "1px solid #222222", marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#F5F5F5" }}>Campaign Progress</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#1AEF22" }}>{task.approved_completions} / {task.target_completion_count} completions</p>
            </div>
            <div style={{ height: 8, background: "#222222", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #1AEF22, #F5A623)", borderRadius: 10, transition: "width 0.4s" }} />
            </div>
            <p style={{ fontSize: 11, color: "#666666", marginTop: 6 }}>{Math.round(progress)}% of target reached</p>
          </div>
        )}

        {/* Completions */}
        <div>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#F5F5F5", marginBottom: 14 }}>Submissions ({completions.length})</p>
          {completions.length === 0 ? (
            <div style={{ background: "#111111", borderRadius: 14, padding: "32px", textAlign: "center", border: "1px solid #222222" }}>
              <p style={{ color: "#888888", fontSize: 14 }}>No submissions yet. Share your task to get started.</p>
            </div>
          ) : (
            <div style={{ background: "#111111", borderRadius: 14, border: "1px solid #222222", overflow: "hidden" }}>
              {completions.map((c, i) => (
                <div key={c.id} style={{ padding: "14px 18px", borderBottom: i < completions.length - 1 ? "1px solid #1a1a1a" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#F5F5F5" }}>{c.full_name}</p>
                    <p style={{ fontSize: 12, color: "#555555", marginTop: 2 }}>{c.email} · {new Date(c.completed_at).toLocaleDateString()}</p>
                    {c.rejection_reason && <p style={{ fontSize: 11, color: "#e53e3e", marginTop: 2 }}>Reason: {c.rejection_reason}</p>}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 8, background: (STATUS_COLORS[c.status] ?? STATUS_COLORS.pending).bg, color: (STATUS_COLORS[c.status] ?? STATUS_COLORS.pending).color }}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
