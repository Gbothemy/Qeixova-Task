"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import BusinessSidebar from "@/components/BusinessSidebar";

interface Task {
  id: number;
  title: string;
  category: string;
  reward: number;
  mission_type: string;
  is_active: boolean;
  status: string;
  total_completions: number;
  approved_completions: number;
  pending_completions: number;
  created_at: string;
}

const statusCopy: Record<string, { label: string; color: string; bg: string }> = {
  pending_review: { label: "Under review", color: "#9a620d", bg: "#fff4df" },
  active: { label: "Active", color: "#147d2f", bg: "#e9fbe9" },
  paused: { label: "Paused", color: "#4b5563", bg: "#f3f4f6" },
};

export default function BusinessTasksPage() {
  const router = useRouter();
  const [business, setBusiness] = useState<{ name: string } | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch("/api/business/tasks")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.tasks) setTasks(data.tasks);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetch("/api/business/me")
      .then((res) => {
        if (!res.ok) {
          router.push("/business/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.business) setBusiness(data.business);
      });
    load();
  }, [router]);

  const totals = useMemo(() => ({
    active: tasks.filter((task) => task.is_active).length,
    pending: tasks.reduce((sum, task) => sum + task.pending_completions, 0),
    approved: tasks.reduce((sum, task) => sum + task.approved_completions, 0),
  }), [tasks]);

  const handleAction = async (id: number, action: string) => {
    await fetch(`/api/business/tasks/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }) });
    load();
  };

  if (!business) {
    return (
      <div style={{ minHeight: "100vh", background: "#f3f4f7", display: "grid", placeItems: "center" }}>
        <div style={{ width: 42, height: 42, border: "3px solid #e5e7eb", borderTopColor: "#F5A623", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <>
      <BusinessSidebar name={business.name} />
      <main className="page-body business-page-pro">
        <div className="businessWorkspace">
          <div className="businessAdsTopbar">
            <div className="businessAdsSearch">
              <Image src="/icon-task.svg" alt="" width={16} height={16} />
              Campaign manager: search by campaign, status, objective
            </div>
            <div className="businessAdsActions">
              <button type="button">Filters</button>
              <Link href="/business/tasks/new" className="primary">Create Campaign</Link>
            </div>
          </div>

          <section className="adsPanel" style={{ padding: 18, marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
              <div>
                <p style={{ color: "#F5A623", fontSize: 11, fontWeight: 950, textTransform: "uppercase", letterSpacing: 1 }}>Ads Manager</p>
                <h1 style={{ color: "#111827", fontSize: "clamp(28px, 4vw, 42px)", lineHeight: 1.05, marginTop: 4 }}>Campaigns</h1>
                <p style={{ color: "#6b7280", fontSize: 14, marginTop: 6 }}>{tasks.length} campaigns · {totals.active} active · {totals.pending} pending submissions</p>
              </div>
              <Link href="/business/tasks/new" style={{ background: "#F5A623", color: "#050505", textDecoration: "none", borderRadius: 12, padding: "12px 16px", fontSize: 13, fontWeight: 950 }}>New campaign</Link>
            </div>
          </section>

          <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 10, marginBottom: 14 }}>
            {[
              ["All campaigns", tasks.length],
              ["Active", totals.active],
              ["Approved actions", totals.approved],
              ["Pending review", totals.pending],
            ].map(([label, value]) => (
              <div key={label} className="adsPanel" style={{ padding: 14 }}>
                <span style={{ color: "#6b7280", fontSize: 11, fontWeight: 900, textTransform: "uppercase" }}>{label}</span>
                <strong style={{ display: "block", color: "#111827", fontSize: 25, marginTop: 6 }}>{Number(value).toLocaleString()}</strong>
              </div>
            ))}
          </section>

          <section className="adsPanel" style={{ overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(260px, 1.5fr) 150px 120px 130px 170px", gap: 12, padding: "12px 16px", borderBottom: "1px solid #e5e7eb", color: "#6b7280", fontSize: 11, fontWeight: 950, textTransform: "uppercase" }}>
              <span>Campaign</span><span>Status</span><span>Budget</span><span>Results</span><span>Actions</span>
            </div>
            {loading ? (
              <div style={{ padding: 28, color: "#6b7280" }}>Loading campaigns...</div>
            ) : tasks.length === 0 ? (
              <div style={{ padding: 44, textAlign: "center" }}>
                <Image src="/icon-create-mission.svg" alt="" width={52} height={52} />
                <h2 style={{ color: "#111827", marginTop: 14 }}>No campaigns yet</h2>
                <p style={{ color: "#6b7280", margin: "6px auto 18px", maxWidth: 360 }}>Create your first campaign and manage delivery from this Ads Manager-style workspace.</p>
                <Link href="/business/tasks/new" style={{ background: "#F5A623", color: "#050505", borderRadius: 11, padding: "11px 15px", textDecoration: "none", fontWeight: 950 }}>Create campaign</Link>
              </div>
            ) : (
              tasks.map((task) => {
                const status = task.status === "pending_review" ? statusCopy.pending_review : task.is_active ? statusCopy.active : statusCopy.paused;
                return (
                  <article key={task.id} style={{ display: "grid", gridTemplateColumns: "minmax(260px, 1.5fr) 150px 120px 130px 170px", gap: 12, alignItems: "center", padding: "14px 16px", borderBottom: "1px solid #eef0f3" }}>
                    <div style={{ minWidth: 0 }}>
                      <Link href={`/business/tasks/${task.id}`} style={{ color: "#111827", fontSize: 14, fontWeight: 900, textDecoration: "none" }}>{task.title}</Link>
                      <p style={{ color: "#6b7280", fontSize: 12, marginTop: 4 }}>{task.category} · {task.mission_type ?? "engagement"}</p>
                    </div>
                    <span style={{ justifySelf: "start", color: status.color, background: status.bg, borderRadius: 999, padding: "6px 9px", fontSize: 11, fontWeight: 950 }}>{status.label}</span>
                    <strong style={{ color: "#111827", fontSize: 13 }}>{task.reward.toLocaleString()} QLT</strong>
                    <span style={{ color: "#111827", fontSize: 13 }}>{task.approved_completions}/{task.total_completions}</span>
                    <div style={{ display: "flex", gap: 7 }}>
                      <Link href={`/business/tasks/${task.id}`} style={{ color: "#111827", background: "#f3f4f6", borderRadius: 9, padding: "8px 10px", textDecoration: "none", fontSize: 12, fontWeight: 900 }}>View</Link>
                      {task.status !== "pending_review" && (
                        <button type="button" onClick={() => handleAction(task.id, task.is_active ? "pause" : "resume")} style={{ border: 0, color: "#111827", background: task.is_active ? "#fff4df" : "#e9fbe9", borderRadius: 9, padding: "8px 10px", fontSize: 12, fontWeight: 900, cursor: "pointer" }}>
                          {task.is_active ? "Pause" : "Resume"}
                        </button>
                      )}
                    </div>
                  </article>
                );
              })
            )}
          </section>
        </div>
      </main>
    </>
  );
}
