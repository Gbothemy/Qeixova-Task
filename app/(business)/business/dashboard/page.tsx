"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BusinessSidebar from "@/components/BusinessSidebar";

interface Stats {
  tasks: { total: number; active: number };
  completions: { total: number; pending: number; approved: number; rejected: number };
}

function MetricCard({ label, value, sub, icon, accent }: { label: string; value: number; sub: string; icon: string; accent: string }) {
  return (
    <article className="adsPanel" style={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", marginBottom: 18 }}>
        <div>
          <p style={{ color: "#bbb", fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</p>
          <strong style={{ display: "block", color: "#F5F5F5", fontSize: 30, marginTop: 7, lineHeight: 1 }}>{value.toLocaleString()}</strong>
        </div>
        <span style={{ width: 38, height: 38, borderRadius: 11, background: `${accent}18`, display: "grid", placeItems: "center" }}>
          <Image src={icon} alt="" width={18} height={18} />
        </span>
      </div>
      <p style={{ color: "#bbb", fontSize: 12 }}>{sub}</p>
    </article>
  );
}

export default function BusinessDashboard() {
  const router = useRouter();
  const [business, setBusiness] = useState<{ name: string; email: string; industry: string; balance: number } | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);

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
      })
      .catch(() => router.push("/business/login"));
    fetch("/api/business/dashboard").then((res) => (res.ok ? res.json() : null)).then((data) => { if (data) setStats(data); });
  }, [router]);

  if (!business) {
    return (
      <div style={{ minHeight: "100vh", background: "#000", display: "grid", placeItems: "center" }}>
        <div style={{ width: 42, height: 42, border: "3px solid #e5e7eb", borderTopColor: "#F5A623", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const cards = [
    { label: "Campaigns", value: stats?.tasks.total ?? 0, sub: `${stats?.tasks.active ?? 0} active campaigns`, icon: "/icon-task.svg", accent: "#4a9eff" },
    { label: "Submissions", value: stats?.completions.total ?? 0, sub: `${stats?.completions.pending ?? 0} awaiting review`, icon: "/icon-survey.svg", accent: "#F5A623" },
    { label: "Approved", value: stats?.completions.approved ?? 0, sub: "Verified contributor actions", icon: "/icon-check-circle.svg", accent: "#1AEF22" },
    { label: "Rejected", value: stats?.completions.rejected ?? 0, sub: "Did not qualify", icon: "/icon-alert.svg", accent: "#e53e3e" },
  ];

  return (
    <>
      <BusinessSidebar name={business.name} />
      <main className="page-body business-page-pro">
        <div className="businessWorkspace">
          <div className="businessAdsTopbar">
            <div className="businessAdsSearch">
              <Image src="/icon-analytics.svg" alt="" width={16} height={16} />
              Search campaigns, audiences, billing, reports
            </div>
            <div className="businessAdsActions">
              <Link href="/business/tasks">Campaigns</Link>
              <Link href="/business/tasks/new" className="primary">Create Campaign</Link>
            </div>
          </div>

          <section className="adsPanel businessHeroPanel" style={{ padding: 20, marginBottom: 16, display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: 16, alignItems: "center" }}>
            <div>
              <p style={{ color: "#F5A623", fontSize: 11, fontWeight: 950, textTransform: "uppercase", letterSpacing: 1 }}>Business Manager</p>
              <h1 className="businessPageTitle" style={{ color: "#fff", fontSize: "clamp(30px, 4vw, 46px)", lineHeight: 1.02, marginTop: 5 }}>Campaign overview</h1>
              <p className="businessIdentityLine" style={{ color: "#bbb", marginTop: 8, fontSize: 14 }}>{business.name} · {business.industry || "Business"} · {business.email}</p>
            </div>
            <div className="businessBalancePanel" style={{ minWidth: 230, border: "1px solid #f1d6a0", background: "rgba(245,166,35,0.08)", borderRadius: 14, padding: 16 }}>
              <span style={{ color: "#bbb", fontSize: 11, fontWeight: 900, textTransform: "uppercase" }}>Available balance</span>
              <strong style={{ display: "block", color: "#F5F5F5", fontSize: 26, marginTop: 6 }}>{Number(business.balance ?? 0).toLocaleString()} QLT</strong>
              <Link href="/business/wallet" style={{ display: "inline-block", marginTop: 10, color: "#F5A623", fontSize: 12, fontWeight: 700 }}>Add funds →</Link>
            </div>
          </section>

          <section className="businessMetricGrid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12, marginBottom: 16 }}>
            {cards.map((card) => <MetricCard key={card.label} {...card} />)}
          </section>

          <section className="adsPanel" style={{ padding: 18, marginBottom: 16 }}>
            <div className="businessSectionHead" style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 14 }}>
              <div>
                <p className="adsSectionTitle">Campaign setup shortcuts</p>
                <p className="adsMuted" style={{ fontSize: 13, marginTop: 3 }}>Pick a common business objective and jump into the guided campaign builder.</p>
              </div>
              <Link href="/business/tasks/new" style={{ background: "#F5A623", color: "#050505", borderRadius: 11, padding: "10px 13px", textDecoration: "none", fontSize: 12, fontWeight: 950 }}>Create</Link>
            </div>
            <div className="businessShortcutGrid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 10 }}>
              {[
                ["Content Distribution", "Flyers, posts, announcements", "/icon-human-distribution.svg"],
                ["Business Awareness", "Products, services, offers", "/icon-local-business.svg"],
                ["Music Promotion", "Songs, snippets, fan buzz", "/icon-music.svg"],
                ["Creator Campaigns", "Reels, pages, livestreams", "/icon-creator.svg"],
              ].map(([title, sub, icon]) => (
                <Link key={title} href="/business/tasks/new" className="adsPanel" style={{ padding: 14, textDecoration: "none", boxShadow: "none" }}>
                  <Image src={icon} alt="" width={24} height={24} />
                  <strong style={{ display: "block", color: "#F5F5F5", marginTop: 10, fontSize: 14 }}>{title}</strong>
                  <span style={{ color: "#bbb", fontSize: 12 }}>{sub}</span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
