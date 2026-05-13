"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import BusinessSidebar from "@/components/BusinessSidebar";

interface Task {
  id: number; title: string; category: string; reward: number; mission_type: string;
  is_active: boolean; status: string;
  total_completions: number; approved_completions: number; pending_completions: number;
  created_at: string;
}

const STATUS: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  pending_review: { label: "Under Review", color: "#F5A623", bg: "rgba(245,166,35,0.08)", dot: "#F5A623" },
  active:         { label: "Active",       color: "#1AEF22", bg: "rgba(26,239,34,0.08)",  dot: "#1AEF22" },
  paused:         { label: "Paused",       color: "#555",    bg: "rgba(255,255,255,0.04)", dot: "#555" },
};

const MISSION_COLORS: Record<string, string> = {
  engagement: "#4a9eff", participation: "#F5A623", premium: "#c084fc",
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
    <div style={{ minHeight: "100vh", background: "#050505", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 32, height: 32, border: "3px solid #1a1a1a", borderTopColor: "#F5A623", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "#F5F5F5", marginBottom: 3 }}>Campaigns</h1>
            <p style={{ fontSize: 13, color: "#444" }}>{tasks.length} campaign{tasks.length !== 1 ? "s" : ""} created</p>
          </div>
          <Link href="/business/tasks/new" style={{
            background: "linear-gradient(135deg, #F5A623, #d89420)", color: "#000",
            textDecoration: "none", padding: "10px 18px", borderRadius: 10,
            fontWeight: 800, fontSize: 13, boxShadow: "0 4px 14px rgba(245,166,35,0.22)",
            display: "flex", alignItems: "center", gap: 7,
          }}>
            <Image src="/icon-content.svg" alt="Create" width={13} height={13} style={{ objectFit: "contain", filter: "brightness(0)" }} />
            New Campaign
          </Link>
        </div>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ background: "#0a0a0a", borderRadius: 14, padding: "16px", border: "1px solid #161616", height: 100, opacity: 0.5 }} />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div style={{ background: "#0a0a0a", borderRadius: 20, padding: "56px 24px", textAlign: "center", border: "1px solid #161616" }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: "#111", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <Image src="/icon-task.svg" alt="No campaigns" width={32} height={32} style={{ objectFit: "contain", opacity: 0.25 }} />
            </div>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#F5F5F5", marginBottom: 8 }}>No campaigns yet</p>
            <p style={{ fontSize: 13, color: "#444", marginBottom: 24, maxWidth: 280, margin: "0 auto 24px" }}>Create your first campaign to start reaching your target audience.</p>
            <Link href="/business/tasks/new" style={{ background: "linear-gradient(135deg, #F5A623, #d89420)", color: "#000", textDecoration: "none", padding: "12px 24px", borderRadius: 11, fontWeight: 800, fontSize: 14 }}>
              Create First Campaign →
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {tasks.map(task => {
              const s = getStatus(task);
              const mColor = MISSION_COLORS[task.mission_type ?? "engagement"] ?? "#4a9eff";
              return (
                <div key={task.id} style={{ background: "#0a0a0a", borderRadius: 16, padding: "16px 18px", border: "1px solid #161616" }}>
                  {/* Top */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#F5F5F5", marginBottom: 5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{task.title}</p>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: mColor, background: mColor + "18", borderRadius: 6, padding: "2px 8px" }}>{task.mission_type ?? "engagement"}</span>
                        <span style={{ fontSize: 11, color: "#444" }}>{task.category}</span>
                        <span style={{ fontSize: 11, color: "#F5A623", fontWeight: 600 }}>{task.reward.toLocaleString()} QLT</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, background: s.bg, borderRadius: 20, padding: "4px 10px" }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: s.dot }} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: s.color }}>{s.label}</span>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div style={{ display: "flex", gap: 20, marginBottom: 14, paddingBottom: 12, borderBottom: "1px solid #111" }}>
                    {[
                      { label: "Submissions", val: task.total_completions,   icon: "/icon-task.svg" },
                      { label: "Approved",    val: task.approved_completions, icon: "/icon-wallet.svg" },
                      { label: "Pending",     val: task.pending_completions,  icon: "/icon-survey.svg" },
                    ].map(st => (
                      <div key={st.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Image src={st.icon} alt={st.label} width={12} height={12} style={{ objectFit: "contain", opacity: 0.35 }} />
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 700, color: "#F5F5F5", lineHeight: 1 }}>{st.val}</p>
                          <p style={{ fontSize: 10, color: "#333", marginTop: 1 }}>{st.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 8 }}>
                    <Link href={`/business/tasks/${task.id}`} style={{ flex: 1, padding: "8px", borderRadius: 9, border: "1px solid #1e1e1e", background: "transparent", color: "#888", textDecoration: "none", fontSize: 12, fontWeight: 600, textAlign: "center" }}>
                      View Details →
                    </Link>
                    {task.status !== "pending_review" && (
                      <button onClick={() => handleAction(task.id, task.is_active ? "pause" : "resume")}
                        style={{ flex: 1, padding: "8px", borderRadius: 9, border: "none", background: task.is_active ? "rgba(229,62,62,0.07)" : "rgba(26,239,34,0.07)", color: task.is_active ? "#e53e3e" : "#1AEF22", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
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
