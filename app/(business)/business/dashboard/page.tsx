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

function StatCard({ label, value, sub, color, icon }: { label: string; value: number; sub: string; color: string; icon: string }) {
  return (
    <div style={{ background: "#0a0a0a", borderRadius: 16, padding: "18px 16px", border: "1px solid #161616", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: color, borderRadius: "16px 16px 0 0" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Image src={icon} alt={label} width={14} height={14} style={{ objectFit: "contain", opacity: 0.8 }} />
        </div>
        <p style={{ fontSize: 11, color: "#aaa", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</p>
      </div>
      <p style={{ fontSize: 28, fontWeight: 900, color: "#F5F5F5", lineHeight: 1, letterSpacing: -1 }}>{value.toLocaleString()}</p>
      <p style={{ fontSize: 11, color: "#999", marginTop: 5 }}>{sub}</p>
    </div>
  );
}

export default function BusinessDashboard() {
  const router = useRouter();
  const [business, setBusiness] = useState<{ name: string; email: string; industry: string; balance: number } | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/business/me").then(r => {
      if (!r.ok) { router.push("/business/login"); return null; }
      return r.json();
    }).then(d => { if (d?.business) setBusiness(d.business); }).catch(() => router.push("/business/login"));
    fetch("/api/business/dashboard").then(r => r.ok ? r.json() : null).then(d => { if (d) setStats(d); });
  }, [router]);

  if (!business) return (
    <div style={{ minHeight: "100vh", background: "#050505", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 48, height: 48, border: "3px solid #1a1a1a", borderTopColor: "#F5A623", borderRadius: "50%", margin: "0 auto 16px", animation: "spin 0.8s linear infinite" }} />
        <p style={{ color: "#999", fontSize: 13 }}>Loading...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const statCards = [
    { label: "Total Campaigns", value: stats?.tasks.total ?? 0,          sub: `${stats?.tasks.active ?? 0} currently active`,  color: "#4a9eff", icon: "/icon-task.svg" },
    { label: "Submissions",     value: stats?.completions.total ?? 0,    sub: `${stats?.completions.pending ?? 0} pending review`,color: "#F5A623", icon: "/icon-survey.svg" },
    { label: "Approved",        value: stats?.completions.approved ?? 0, sub: "Verified completions",                            color: "#1AEF22", icon: "/icon-wallet.svg" },
    { label: "Rejected",        value: stats?.completions.rejected ?? 0, sub: "Did not qualify",                                 color: "#e53e3e", icon: "/icon-app-testing.svg" },
  ];

  const approvalRate = stats && (stats.completions.approved + stats.completions.rejected) > 0
    ? Math.round((stats.completions.approved / (stats.completions.approved + stats.completions.rejected)) * 100)
    : null;

  return (
    <>
      <BusinessSidebar name={business.name} />
      <main className="page-body">

        {/* Page header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, background: "linear-gradient(135deg, #F5A623, #d89420)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 14px rgba(245,166,35,0.25)" }}>
              <Image src="/icon-profile.svg" alt="Business" width={22} height={22} style={{ objectFit: "contain", filter: "brightness(0)" }} />
            </div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: "#F5F5F5", letterSpacing: -0.3 }}>Welcome back, {business.name}</h1>
              <p style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>{business.industry || "Business"} · {business.email}</p>
            </div>
          </div>
          {approvalRate !== null && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: approvalRate >= 70 ? "rgba(26,239,34,0.07)" : "rgba(245,166,35,0.07)", border: `1px solid ${approvalRate >= 70 ? "rgba(26,239,34,0.15)" : "rgba(245,166,35,0.15)"}`, borderRadius: 20, padding: "4px 12px", marginTop: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: approvalRate >= 70 ? "#1AEF22" : "#F5A623" }} />
              <span style={{ fontSize: 12, color: approvalRate >= 70 ? "#1AEF22" : "#F5A623", fontWeight: 600 }}>{approvalRate}% approval rate</span>
            </div>
          )}
        </div>

        {/* Stats grid */}
        <div style={{ background: "#0a0a0a", borderRadius: 18, padding: "18px", border: "1px solid #161616", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <div>
            <p style={{ fontSize: 12, color: "#aaa", fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 5 }}>Campaign funding balance</p>
            <p style={{ fontSize: 28, fontWeight: 900, color: "#F5A623", letterSpacing: 0 }}>{Number(business.balance ?? 0).toLocaleString()} QLT</p>
            <p style={{ fontSize: 12, color: "#888", marginTop: 4 }}>Fund your wallet before launching campaigns.</p>
          </div>
          <Link href="/business/wallet" style={{ background: "#F5A623", color: "#000", textDecoration: "none", padding: "11px 18px", borderRadius: 11, fontWeight: 900, fontSize: 13 }}>
            Add Funds
          </Link>
        </div>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12, marginBottom: 24 }}>
          {statCards.map(s => <StatCard key={s.label} {...s} />)}
        </div>

        {/* CTA banner */}
        <div style={{ background: "linear-gradient(135deg, #0d0d0d 0%, #111 100%)", borderRadius: 18, padding: "22px 20px", border: "1px solid #1a1a1a", marginBottom: 16, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 140, height: 140, borderRadius: "50%", background: "rgba(245,166,35,0.04)" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14, position: "relative" }}>
            <div>
              <p style={{ fontSize: 16, fontWeight: 800, color: "#F5F5F5", marginBottom: 5 }}>Launch a new campaign</p>
              <p style={{ fontSize: 13, color: "#aaa" }}>Reach verified users with targeted missions.</p>
            </div>
            <Link href="/business/tasks/new" style={{
              background: "linear-gradient(135deg, #F5A623, #d89420)", color: "#000",
              textDecoration: "none", padding: "11px 22px", borderRadius: 11,
              fontWeight: 800, fontSize: 13, boxShadow: "0 4px 16px rgba(245,166,35,0.28)",
              whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 7,
            }}>
              <Image src="/icon-content.svg" alt="Create" width={14} height={14} style={{ objectFit: "contain", filter: "brightness(0)" }} />
              Create Campaign
            </Link>
          </div>
        </div>

        {/* Quick links */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { href: "/business/tasks",     icon: "/icon-task.svg",    label: "View Campaigns",  sub: "Manage all missions" },
            { href: "/business/wallet",    icon: "/icon-wallet.svg",  label: "Fund Wallet",     sub: "Add campaign credits" },
            { href: "/business/tasks/new", icon: "/icon-content.svg", label: "New Campaign",    sub: "Launch a mission" },
          ].map(item => (
            <Link key={item.href} href={item.href} style={{ background: "#0a0a0a", border: "1px solid #161616", borderRadius: 14, padding: "14px 16px", textDecoration: "none", display: "flex", alignItems: "center", gap: 12, transition: "border-color 0.15s" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#111", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Image src={item.icon} alt={item.label} width={18} height={18} style={{ objectFit: "contain", opacity: 0.5 }} />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#ccc" }}>{item.label}</p>
                <p style={{ fontSize: 11, color: "#999", marginTop: 1 }}>{item.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
