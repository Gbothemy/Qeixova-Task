"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import BusinessSidebar from "@/components/BusinessSidebar";

interface Stats {
  tasks: { total: number; active: number };
  completions: { total: number; pending: number; approved: number; rejected: number };
}

export default function BusinessDashboard() {
  const router = useRouter();
  const [business, setBusiness] = useState<{ name: string; email: string; industry: string } | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/business/me").then(r => {
      if (!r.ok) { router.push("/business/login"); return null; }
      return r.json();
    }).then(d => { if (d?.business) setBusiness(d.business); }).catch(() => router.push("/business/login"));
    fetch("/api/business/dashboard").then(r => r.ok ? r.json() : null).then(d => { if (d) setStats(d); });
  }, [router]);

  if (!business) return (
    <div style={{ minHeight: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <Image src="/qeixova-icon.png" alt="Loading" width={48} height={48} style={{ borderRadius: 12, opacity: 0.5, marginBottom: 12 }} />
        <p style={{ color: "#444", fontSize: 14 }}>Loading...</p>
      </div>
    </div>
  );

  const statCards = [
    { label: "Total Tasks",      value: stats?.tasks.total ?? 0,          sub: `${stats?.tasks.active ?? 0} active`,       color: "#1AEF22", icon: "/icon-task.png" },
    { label: "Submissions",      value: stats?.completions.total ?? 0,    sub: `${stats?.completions.pending ?? 0} pending`,color: "#F5A623", icon: "/icon-survey.png" },
    { label: "Approved",         value: stats?.completions.approved ?? 0, sub: "Verified completions",                      color: "#1AEF22", icon: "/icon-wallet.png" },
    { label: "Rejected",         value: stats?.completions.rejected ?? 0, sub: "Did not qualify",                           color: "#e53e3e", icon: "/icon-app-testing.png" },
  ];

  return (
    <>
      <BusinessSidebar name={business.name} />
      <main className="page-body" style={{ padding: "24px 20px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28, flexWrap: "wrap" }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg, #F5A623, #d89420)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🏢</div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "#F5F5F5", marginBottom: 2 }}>Welcome back, {business.name}</h1>
            <p style={{ fontSize: 13, color: "#555" }}>{business.industry || "Business"} · {business.email}</p>
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12, marginBottom: 28 }}>
          {statCards.map(s => (
            <div key={s.label} style={{ background: "#0d0d0d", borderRadius: 14, padding: "16px", border: "1px solid #1a1a1a", borderTop: `3px solid ${s.color}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <Image src={s.icon} alt={s.label} width={16} height={16} style={{ objectFit: "contain", opacity: 0.5 }} />
                <p style={{ fontSize: 11, color: "#555", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4 }}>{s.label}</p>
              </div>
              <p style={{ fontSize: 26, fontWeight: 800, color: "#F5F5F5", lineHeight: 1 }}>{s.value.toLocaleString()}</p>
              <p style={{ fontSize: 11, color: "#444", marginTop: 4 }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ background: "linear-gradient(135deg, #0d0d0d, #111)", borderRadius: 18, padding: "24px 20px", border: "1px solid #1a1a1a", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(245,166,35,0.04)" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, position: "relative" }}>
            <div>
              <p style={{ fontSize: 16, fontWeight: 800, color: "#F5F5F5", marginBottom: 6 }}>Ready to launch a campaign?</p>
              <p style={{ fontSize: 13, color: "#555" }}>Create a task and reach your target audience.</p>
            </div>
            <Link href="/business/tasks/new" style={{
              background: "linear-gradient(135deg, #F5A623, #d89420)", color: "#000",
              textDecoration: "none", padding: "11px 22px", borderRadius: 11,
              fontWeight: 800, fontSize: 14, boxShadow: "0 4px 16px rgba(245,166,35,0.3)",
              whiteSpace: "nowrap",
            }}>
              + Create Task
            </Link>
          </div>
        </div>

        {/* Quick links */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 16 }}>
          <Link href="/business/tasks" style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 12, padding: "14px 16px", textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            <Image src="/icon-task.png" alt="Tasks" width={20} height={20} style={{ objectFit: "contain", opacity: 0.6 }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#aaa" }}>View Tasks</span>
          </Link>
          <Link href="/business/tasks/new" style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 12, padding: "14px 16px", textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            <Image src="/icon-content.png" alt="Create" width={20} height={20} style={{ objectFit: "contain", opacity: 0.6 }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#aaa" }}>New Campaign</span>
          </Link>
        </div>
      </main>
    </>
  );
}
