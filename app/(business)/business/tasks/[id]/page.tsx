"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import BusinessSidebar from "@/components/BusinessSidebar";

interface Completion { id: number; full_name: string; email: string; status: string; completed_at: string; rejection_reason: string | null; }
interface Task { id: number; title: string; category: string; reward: number; mission_type: string; is_active: boolean; status: string; total_completions: number; approved_completions: number; pending_completions: number; rejected_completions: number; target_completion_count: number; created_at: string; }

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  pending:  { bg: "rgba(245,166,35,0.08)", color: "#F5A623" },
  approved: { bg: "rgba(26,239,34,0.08)",  color: "#1AEF22" },
  rejected: { bg: "rgba(229,62,62,0.08)",  color: "#e53e3e" },
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

  if (!business || !task) return (
    <div style={{ minHeight: "100vh", background: "#050505", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 32, height: 32, border: "3px solid #1a1a1a", borderTopColor: "#F5A623", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const progress = task.target_completion_count > 0
    ? Math.min((task.approved_completions / task.target_completion_count) * 100, 100) : 0;

  const taskStatus = task.status === "pending_review"
    ? { label: "Under Review", color: "#F5A623", bg: "rgba(245,166,35,0.08)", dot: "#F5A623" }
    : task.is_active
    ? { label: "Active", color: "#1AEF22", bg: "rgba(26,239,34,0.08)", dot: "#1AEF22" }
    : { label: "Paused", color: "#555", bg: "rgba(255,255,255,0.04)", dot: "#555" };

  return (
    <>
      <BusinessSidebar name={business.name} />
      <main className="page-body">

        {/* Back */}
        <Link href="/business/tasks" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "#444", textDecoration: "none", marginBottom: 20, padding: "6px 12px", background: "#0a0a0a", borderRadius: 8, border: "1px solid #161616" }}>
          <Image src="/icon-home.png" alt="Back" width={12} height={12} style={{ objectFit: "contain", opacity: 0.4 }} />
          Back to Campaigns
        </Link>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: "#F5F5F5" }}>{task.title}</h1>
              <div style={{ display: "flex", alignItems: "center", gap: 5, background: taskStatus.bg, borderRadius: 20, padding: "4px 10px" }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: taskStatus.dot }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: taskStatus.color }}>{taskStatus.label}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "#444" }}>{task.category}</span>
              <span style={{ fontSize: 12, color: "#F5A623", fontWeight: 600 }}>{task.reward.toLocaleString()} QLT / completion</span>
              <span style={{ fontSize: 11, color: "#333" }}>Created {new Date(task.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          {task.status !== "pending_review" && (
            <button onClick={() => handleAction(task.is_active ? "pause" : "resume")} disabled={actionLoading}
              style={{ padding: "9px 18px", borderRadius: 10, border: "none", background: task.is_active ? "rgba(229,62,62,0.08)" : "rgba(26,239,34,0.08)", color: task.is_active ? "#e53e3e" : "#1AEF22", fontWeight: 700, fontSize: 13, cursor: "pointer", flexShrink: 0, border2: `1px solid ${task.is_active ? "rgba(229,62,62,0.15)" : "rgba(26,239,34,0.15)"}` } as React.CSSProperties}>
              {task.is_active ? "⏸ Pause" : "▶ Resume"}
            </button>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 10, marginBottom: 20 }}>
          {[
            { label: "Submissions", value: task.total_completions,   color: "#4a9eff", icon: "/icon-task.png" },
            { label: "Approved",    value: task.approved_completions, color: "#1AEF22", icon: "/icon-wallet.png" },
            { label: "Pending",     value: task.pending_completions,  color: "#F5A623", icon: "/icon-survey.png" },
            { label: "Rejected",    value: task.rejected_completions, color: "#e53e3e", icon: "/icon-app-testing.png" },
          ].map(s => (
            <div key={s.label} style={{ background: "#0a0a0a", borderRadius: 14, padding: "14px", border: "1px solid #161616", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: s.color }} />
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <Image src={s.icon} alt={s.label} width={12} height={12} style={{ objectFit: "contain", opacity: 0.35 }} />
                <p style={{ fontSize: 10, color: "#333", textTransform: "uppercase", letterSpacing: 0.4, fontWeight: 600 }}>{s.label}</p>
              </div>
              <p style={{ fontSize: 24, fontWeight: 900, color: "#F5F5F5", letterSpacing: -0.5 }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        {task.target_completion_count > 0 && (
          <div style={{ background: "#0a0a0a", borderRadius: 14, padding: "16px 18px", border: "1px solid #161616", marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#F5F5F5" }}>Campaign Progress</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#F5A623" }}>{task.approved_completions} / {task.target_completion_count}</p>
            </div>
            <div style={{ height: 6, background: "#111", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #F5A623, #1AEF22)", borderRadius: 10, transition: "width 0.4s" }} />
            </div>
            <p style={{ fontSize: 11, color: "#333", marginTop: 6 }}>{Math.round(progress)}% of target reached</p>
          </div>
        )}

        {/* Submissions */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#F5F5F5" }}>Submissions</p>
            <span style={{ fontSize: 12, color: "#444", background: "#0a0a0a", border: "1px solid #161616", borderRadius: 20, padding: "3px 10px" }}>{completions.length} total</span>
          </div>
          {completions.length === 0 ? (
            <div style={{ background: "#0a0a0a", borderRadius: 14, padding: "36px", textAlign: "center", border: "1px solid #161616" }}>
              <Image src="/icon-survey.png" alt="" width={36} height={36} style={{ objectFit: "contain", opacity: 0.15, marginBottom: 12 }} />
              <p style={{ color: "#333", fontSize: 13 }}>No submissions yet. Share your campaign to get started.</p>
            </div>
          ) : (
            <div style={{ background: "#0a0a0a", borderRadius: 14, border: "1px solid #161616", overflow: "hidden" }}>
              {completions.map((c, i) => {
                const sc = STATUS_COLORS[c.status] ?? STATUS_COLORS.pending;
                return (
                  <div key={c.id} style={{ padding: "13px 16px", borderBottom: i < completions.length - 1 ? "1px solid #111" : "none", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#111", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Image src="/icon-profile.png" alt="" width={16} height={16} style={{ objectFit: "contain", opacity: 0.3 }} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "#F5F5F5", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.full_name}</p>
                        <p style={{ fontSize: 11, color: "#333", marginTop: 1 }}>{c.email} · {new Date(c.completed_at).toLocaleDateString()}</p>
                        {c.rejection_reason && <p style={{ fontSize: 11, color: "#e53e3e", marginTop: 2 }}>↳ {c.rejection_reason}</p>}
                      </div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 8, background: sc.bg, color: sc.color, flexShrink: 0 }}>
                      {c.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
