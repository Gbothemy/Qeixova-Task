"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import BalanceCard from "@/components/BalanceCard";
import BottomNav from "@/components/BottomNav";
import OnboardingFlow from "@/components/OnboardingFlow";
import { useAuth } from "@/lib/useAuth";

interface WalletData {
  balance: number;
  stats: { tasks_today: number; today_earned: number; tasks_total: number; total_accumulated: number; total_withdrawn: number; };
  transactions: { type: string; label: string; amount: number; created_at: string }[];
}

const categories = [
  { icon: "/icon-social-media.jpg", label: "Social Media", color: "rgba(26,239,34,0.1)",  earn: "10k–15k QLT" },
  { icon: "/icon-survey.png",      label: "Surveys",      color: "rgba(245,166,35,0.1)", earn: "35k–50k QLT" },
  { icon: "/icon-app-testing.png", label: "App Testing",  color: "rgba(26,239,34,0.1)",  earn: "80k–120k QLT" },
  { icon: "/icon-content.png",     label: "Content",      color: "rgba(245,166,35,0.1)", earn: "18k–20k QLT" },
];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "Just now";
  if (h < 24) return `${h}h ago`;
  if (h < 48) return "Yesterday";
  return `${Math.floor(diff / 86400000)} days ago`;
}

export default function Home() {
  const { user, loading } = useAuth();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = () => fetch("/api/wallet").then(r => r.ok ? r.json() : null).then(d => { if (d) setWallet(d); }).catch(() => {});
    load();
    window.addEventListener("balanceUpdated", load);

    // Check onboarding status
    fetch("/api/onboarding").then(r => r.ok ? r.json() : null).then(d => {
      if (d && d.onboarding_completed === false) setShowOnboarding(true);
    }).catch(() => {});

    return () => window.removeEventListener("balanceUpdated", load);
  }, [user]);

  if (loading) return <LoadingScreen />;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="page-body" style={{ background: "#000000", minHeight: "100vh" }}>
      {showOnboarding && user && (
        <OnboardingFlow userName={user.fullName} onComplete={() => setShowOnboarding(false)} />
      )}
      {/* Header */}
      <div className="page-header" style={{ background: "#0a0a0a", borderBottom: "1px solid #222222", padding: "52px 20px 90px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(26,239,34,0.03)" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1AEF22", boxShadow: "0 0 8px #1AEF22" }} />
              <p style={{ color: "#555555", fontSize: 13 }}>{greeting()} 👋</p>
            </div>
            <p style={{ color: "#F5F5F5", fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>
              {user?.fullName?.split(" ")[0] ?? "Welcome back"}!
            </p>
          </div>
          <div style={{ width: 42, height: 42, borderRadius: 13, background: "#111111", border: "1px solid #222222", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Image src="/icon-home.png" alt="notifications" width={22} height={22} style={{ objectFit: "contain", opacity: 0.7 }} />
          </div>
        </div>
        {user && user.streak > 0 && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(26,239,34,0.08)", border: "1px solid rgba(26,239,34,0.2)", borderRadius: 20, padding: "5px 14px", marginTop: 14 }}>
            <span style={{ fontSize: 14 }}>🔥</span>
            <span style={{ color: "#1AEF22", fontSize: 12, fontWeight: 700 }}>{user.streak}-day streak — Keep it up!</span>
          </div>
        )}
      </div>

      {/* Balance card */}
      <div style={{ marginTop: -64, position: "relative", zIndex: 10 }}>
        <BalanceCard
          balance={wallet?.balance ?? user?.balance ?? 0}
          todayEarned={wallet?.stats?.today_earned ?? 0}
          tasksToday={wallet?.stats?.tasks_today ?? 0}
          totalAccumulated={wallet?.stats?.total_accumulated ?? 0}
          totalWithdrawn={wallet?.stats?.total_withdrawn ?? 0}
          tasksTotal={wallet?.stats?.tasks_total ?? 0}
        />
      </div>

      {/* Quick actions */}
      <div style={{ padding: "20px 16px 0" }}>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/wallet" style={{ flex: 1, background: "#111111", border: "1.5px solid #222222", color: "#1AEF22", borderRadius: 14, padding: "14px 0", textAlign: "center", fontWeight: 700, fontSize: 14, textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            💸 Withdraw
          </Link>
          <Link href="/tasks" style={{ flex: 1, background: "linear-gradient(135deg, #F5A623, #d89420)", color: "#000", borderRadius: 14, padding: "14px 0", textAlign: "center", fontWeight: 800, fontSize: 14, textDecoration: "none", boxShadow: "0 4px 16px rgba(245,166,35,0.35)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            ⚡ Earn Now
          </Link>
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding: "28px 16px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <p style={{ fontWeight: 800, fontSize: 17, color: "#F5F5F5" }}>Task Categories</p>
          <Link href="/tasks" style={{ fontSize: 13, color: "#1AEF22", fontWeight: 600, textDecoration: "none" }}>See all →</Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="category-grid">
          {categories.map((cat) => (
            <Link key={cat.label} href="/tasks" style={{ textDecoration: "none" }}>
              <div style={{ background: "#111111", borderRadius: 18, padding: "18px 16px", border: "1px solid #222222" }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: cat.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                  <Image src={cat.icon} alt={cat.label} width={28} height={28} style={{ objectFit: "contain" }} />
                </div>
                <p style={{ fontWeight: 700, fontSize: 13, color: "#F5F5F5", marginBottom: 3 }}>{cat.label}</p>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#F5A623", background: "rgba(245,166,35,0.1)", borderRadius: 6, padding: "2px 8px", display: "inline-block" }}>{cat.earn}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ padding: "28px 16px 0" }}>
        <p style={{ fontWeight: 800, fontSize: 17, color: "#F5F5F5", marginBottom: 16 }}>Recent Activity</p>
        {wallet?.transactions?.length ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {wallet.transactions.slice(0, 5).map((tx, i) => (
              <div key={i} style={{ background: "#111111", borderRadius: 16, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #222222" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: tx.type === "credit" ? "rgba(26,239,34,0.12)" : "rgba(229,62,62,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Image src={tx.type === "credit" ? "/icon-task.png" : "/icon-wallet.png"} alt="tx" width={20} height={20} style={{ objectFit: "contain" }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#F5F5F5" }}>{tx.label}</p>
                    <p style={{ fontSize: 11, color: "#555555", marginTop: 2 }}>{timeAgo(tx.created_at)}</p>
                  </div>
                </div>
                <div style={{ background: tx.type === "credit" ? "rgba(26,239,34,0.12)" : "rgba(229,62,62,0.12)", borderRadius: 10, padding: "5px 12px" }}>
                  <p style={{ fontWeight: 800, color: tx.type === "credit" ? "#1AEF22" : "#e53e3e", fontSize: 13 }}>
                    {tx.type === "credit" ? "+" : "-"}{tx.amount.toLocaleString()} QLT
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background: "#111111", borderRadius: 16, padding: "32px", textAlign: "center", border: "1px solid #222222" }}>
            <p style={{ fontSize: 32, marginBottom: 8 }}>📊</p>
            <p style={{ color: "#555555", fontSize: 14 }}>No activity yet — complete your first task!</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

function LoadingScreen() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#000000" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>⚡</div>
        <p style={{ color: "#1AEF22", fontWeight: 700 }}>Loading...</p>
      </div>
    </div>
  );
}
