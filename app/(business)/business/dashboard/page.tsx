"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BusinessSidebar from "@/components/BusinessSidebar";

interface Stats { tasks: { total: number; active: number }; completions: { total: number; pending: number; approved: number; rejected: number; total_qlт_spent: number } }

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

  if (!business) return <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: "#888" }}>Loading...</p></div>;

  const statCards = [
    { label: "Total Tasks", value: stats?.tasks.total ?? 0, sub: `${stats?.tasks.active ?? 0} active`, color: "#1AEF22" },
    { label: "Total Submissions", value: stats?.completions.total ?? 0, sub: `${stats?.completions.pending ?? 0} pending review`, color: "#F5A623" },
    { label: "Approved", value: stats?.completions.approved ?? 0, sub: "Verified completions", color: "#1AEF22" },
    { label: "Rejected", value: stats?.completions.rejected ?? 0, sub: "Did not qualify", color: "#e53e3e" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#000000" }}>
      <BusinessSidebar name={business.name} />
      <main style={{ flex: 1, padding: "40px 32px", overflowY: "auto" }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#F5F5F5", marginBottom: 4 }}>Welcome back, {business.name}</h1>
          <p style={{ fontSize: 14, color: "#888888" }}>{business.industry || "Business"} · {business.email}</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
          {statCards.map(s => (
            <div key={s.label} style={{ background: "#111111", borderRadius: 14, padding: "20px", border: "1px solid #222222", borderLeft: `4px solid ${s.color}` }}>
              <p style={{ fontSize: 12, color: "#888888", fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</p>
              <p style={{ fontSize: 28, fontWeight: 800, color: "#F5F5F5" }}>{s.value.toLocaleString()}</p>
              <p style={{ fontSize: 12, color: "#555555", marginTop: 4 }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ background: "linear-gradient(135deg, #111111, #1a1a1a)", borderRadius: 18, padding: "28px 24px", border: "1px solid #222222", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ fontSize: 18, fontWeight: 800, color: "#F5F5F5", marginBottom: 6 }}>Ready to launch a campaign?</p>
            <p style={{ fontSize: 14, color: "#888888" }}>Create a task and reach your target audience on Qeixova.</p>
          </div>
          <Link href="/business/tasks/new" style={{ background: "linear-gradient(135deg, #F5A623, #d89420)", color: "#000", textDecoration: "none", padding: "12px 24px", borderRadius: 12, fontWeight: 800, fontSize: 14, boxShadow: "0 4px 16px rgba(245,166,35,0.35)" }}>
            Create Task →
          </Link>
        </div>
      </main>
    </div>
  );
}
