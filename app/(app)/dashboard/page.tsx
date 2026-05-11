"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  { icon: "/icon-social-media.jpg", label: "Engagement",    color: "rgba(74,158,255,0.1)",  earn: "10k–15k QLT", badge: "#4a9eff" },
  { icon: "/icon-survey.png",       label: "Participation", color: "rgba(245,166,35,0.1)",  earn: "35k–50k QLT", badge: "#F5A623" },
  { icon: "/icon-app-testing.png",  label: "Premium",       color: "rgba(192,132,252,0.1)", earn: "80k–120k QLT", badge: "#c084fc" },
  { icon: "/icon-content.png",      label: "AI Testing",    color: "rgba(26,239,34,0.1)",   earn: "18k–20k QLT", badge: "#1AEF22" },
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
  const router = useRouter();

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
        <OnboardingFlow userName={user.fullName} onComplete={() => { setShowOnboarding(false); router.push("/tasks"); }} />
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

      {/* First Task Banner */}
      {wallet && wallet.stats.tasks_total === 0 && (
        <div style={{ padding: "20px 16px 0" }}>
          <Link href="/tasks" style={{ textDecoration: "none" }}>
            <div style={{ background: "#111111", borderRadius: 18, padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, border: "1px solid #1AEF22", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, borderRadius: "50%", background: "rgba(26,239,34,0.05)" }} />
              <div style={{ flex: 1 }}>
                <p style={{ color: "#F5F5F5", fontWeight: 800, fontSize: 16, marginBottom: 4 }}>Complete your first mission</p>
                <p style={{ color: "#888888", fontSize: 13 }}>Start earning QLT — missions take 1–10 minutes</p>
              </div>
              <div style={{ background: "#ffffff", borderRadius: 12, padding: "12px 20px", flexShrink: 0 }}>
                <span style={{ color: "#000000", fontWeight: 800, fontSize: 14, whiteSpace: "nowrap" }}>Start →</span>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* QLT Level progress */}
      {user && (
        <div style={{ padding: "16px 16px 0" }}>
          <div style={{ background: "#111111", borderRadius: 16, padding: "16px 18px", border: "1px solid #222222" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 16 }}>{(user as Record<string, unknown>).badgeEmoji as string ?? "🟢"}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: (user as Record<string, unknown>).badgeColor as string ?? "#1AEF22" }}>
                  {(user as Record<string, unknown>).levelName as string ?? "Starter"}
                </span>
              </div>
              {(user as Record<string, unknown>).nextLevel ? (
                <span style={{ fontSize: 11, color: "#555" }}>
                  {((user as Record<string, unknown>).qltToNextLevel as number ?? 0).toLocaleString()} QLT to {((user as Record<string, unknown>).nextLevel as Record<string, unknown>)?.emoji as string} {((user as Record<string, unknown>).nextLevel as Record<string, unknown>)?.name as string}
                </span>
              ) : (
                <span style={{ fontSize: 11, color: "#F5A623", fontWeight: 700 }}>Max Level 👑</span>
              )}
            </div>
            <div style={{ height: 5, background: "#222", borderRadius: 10, overflow: "hidden", marginBottom: 6 }}>
              <div style={{
                height: "100%",
                width: `${(user as Record<string, unknown>).progressPct as number ?? 0}%`,
                background: "linear-gradient(90deg, #1AEF22, #F5A623)",
                borderRadius: 10, transition: "width 0.4s",
              }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, color: "#444" }}>
                {((user as Record<string, unknown>).total_earned_qlt as number ?? 0).toLocaleString()} QLT earned lifetime
              </span>
              {!(user as Record<string, unknown>).canWithdraw && (
                <span style={{ fontSize: 11, color: "#F5A623", fontWeight: 600 }}>
                  🔒 Withdrawals unlock at Bronze
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div style={{ padding: "20px 16px 0" }}>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/wallet" style={{ flex: 1, background: "#ffffff", border: "none", color: "#000000", borderRadius: 14, padding: "14px 0", textAlign: "center", fontWeight: 700, fontSize: 14, textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            Withdraw
          </Link>
          <Link href="/tasks" style={{ flex: 1, background: "linear-gradient(135deg, #F5A623, #d89420)", color: "#000", borderRadius: 14, padding: "14px 0", textAlign: "center", fontWeight: 800, fontSize: 14, textDecoration: "none", boxShadow: "0 4px 16px rgba(245,166,35,0.35)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            ⚡ Earn Now
          </Link>
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding: "28px 16px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <p style={{ fontWeight: 800, fontSize: 17, color: "#F5F5F5" }}>Mission Types</p>
          <Link href="/tasks" style={{ fontSize: 13, color: "#1AEF22", fontWeight: 600, textDecoration: "none" }}>Browse all →</Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="category-grid">
          {categories.map((cat) => (
            <Link key={cat.label} href="/tasks" style={{ textDecoration: "none" }}>
              <div style={{ background: "#111111", borderRadius: 18, padding: "18px 16px", border: "1px solid #222222" }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: cat.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                  <Image src={cat.icon} alt={cat.label} width={28} height={28} style={{ objectFit: "contain" }} />
                </div>
                <p style={{ fontWeight: 700, fontSize: 13, color: "#F5F5F5", marginBottom: 3 }}>{cat.label}</p>
                <p style={{ fontSize: 11, fontWeight: 700, color: cat.badge, background: cat.color, borderRadius: 6, padding: "2px 8px", display: "inline-block" }}>{cat.earn}</p>
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

      {/* Step 6 — Daily Progress Bar */}
      {wallet && wallet.stats.tasks_today > 0 && (
        <div style={{ padding: "20px 16px 0" }}>
          <div style={{ background: "#111111", borderRadius: 16, padding: "16px 18px", border: "1px solid #222222" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#F5F5F5" }}>Complete 3 missions today</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#1AEF22" }}>{Math.min(wallet.stats.tasks_today, 3)}/3</p>
            </div>
            <div style={{ height: 6, background: "#222222", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.min((wallet.stats.tasks_today / 3) * 100, 100)}%`, background: "linear-gradient(90deg, #1AEF22, #F5A623)", borderRadius: 10, transition: "width 0.4s ease" }} />
            </div>
            <p style={{ fontSize: 11, color: "#666666", marginTop: 8 }}>Stay active and earn more consistently.</p>
          </div>
        </div>
      )}

      {/* Step 10 — Exit Hook */}
      <div style={{ padding: "20px 16px 0" }}>
        <div style={{ background: "#0a0a0a", borderRadius: 14, padding: "14px 16px", border: "1px solid #1a1a1a", textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "#888888" }}>New tasks are added daily. Come back to earn more.</p>
        </div>
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
