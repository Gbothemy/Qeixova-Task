"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const nav = [
  { href: "/dashboard",   label: "Home",     icon: "/icon-home.svg",        desc: "Dashboard" },
  { href: "/tasks",       label: "Missions", icon: "/icon-task.svg",        desc: "Browse & earn" },
  { href: "/leaderboard", label: "Ranks",    icon: "/icon-leaderboard.svg", desc: "Leaderboard" },
  { href: "/wallet",      label: "Wallet",   icon: "/icon-wallet.svg",      desc: "Balance & withdraw" },
  { href: "/profile",     label: "Profile",  icon: "/icon-profile.svg",     desc: "Account settings" },
];

export default function Sidebar() {
  const path = usePathname();
  const router = useRouter();
  const [stats, setStats] = useState({ balance: 0, today_earned: 0, tasks_today: 0, streak: 0, fullName: "", xp: 0, levelName: "Starter", badgeColor: "#888888" });

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.ok ? r.json() : null).then(d => {
      if (d?.user) setStats(s => ({ ...s, fullName: d.user.full_name, streak: d.user.streak ?? 0, xp: d.user.xp ?? 0, levelName: d.user.levelName ?? "Starter", badgeColor: d.user.badgeColor ?? "#888888" }));
    }).catch(() => {});
    fetch("/api/wallet").then(r => r.ok ? r.json() : null).then(d => {
      if (d) setStats(s => ({ ...s, balance: d.balance ?? 0, today_earned: d.stats?.today_earned ?? 0, tasks_today: d.stats?.tasks_today ?? 0 }));
    }).catch(() => {});
  }, [path]);

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div style={{ padding: "32px 24px 24px", borderBottom: "1px solid #222222" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Image src="/qeixova-icon.png" alt="Qeixova" width={40} height={40} style={{ borderRadius: 12, objectFit: "contain" }} />
          <div>
            <p style={{ fontWeight: 800, fontSize: 16, color: "#F5F5F5", letterSpacing: -0.5 }}>Qeixova</p>
            <p style={{ fontSize: 11, color: "#555555" }}>Earn by doing</p>
          </div>
        </div>
      </div>

      {/* Balance pill */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #222222" }}>
        <div style={{ background: "linear-gradient(135deg, #1AEF22, #06B517)", borderRadius: 14, padding: "14px 16px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(245,166,35,0.12)" }} />
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>Available Balance</p>
          <p style={{ fontSize: 20, fontWeight: 800, color: "#000", letterSpacing: -0.5 }}>
            {stats.balance.toLocaleString()} QLT
          </p>
          <p style={{ fontSize: 11, color: "#000", marginTop: 4, fontWeight: 600, opacity: 0.7 }}>
            +{stats.today_earned.toLocaleString()} QLT today &middot; {stats.tasks_today} tasks
          </p>
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ padding: "12px 12px", flex: 1 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: "#444444", letterSpacing: 1.2, textTransform: "uppercase", padding: "8px 12px 4px" }}>Menu</p>
        {nav.map((item) => {
          const active = path === item.href;
          return (
            <Link key={item.href} href={item.href} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "11px 14px", borderRadius: 12, textDecoration: "none",
              background: active ? "rgba(26,239,34,0.1)" : "transparent",
              marginBottom: 2, transition: "background 0.15s",
              border: active ? "1px solid rgba(26,239,34,0.25)" : "1px solid transparent",
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: active ? "linear-gradient(135deg, #1AEF22, #06B517)" : "#1a1a1a",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: active ? "0 3px 10px rgba(26,239,34,0.3)" : "none",
                flexShrink: 0,
              }}>
                <Image src={item.icon} alt={item.label} width={20} height={20} style={{ objectFit: "contain", filter: active ? "brightness(0)" : "invert(40%) brightness(60%)" }} />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: active ? 700 : 500, color: active ? "#1AEF22" : "#cccccc" }}>{item.label}</p>
                <p style={{ fontSize: 11, color: "#555555" }}>{item.desc}</p>
              </div>
              {active && <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#1AEF22" }} />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div style={{ padding: "16px 20px 24px", borderTop: "1px solid #222222" }}>
        <div style={{ background: "linear-gradient(135deg, #F5A623, #d89420)", borderRadius: 14, padding: "14px 16px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -15, right: -15, width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
          <p style={{ fontSize: 13, fontWeight: 700, color: "#000", marginBottom: 3 }}>
            {stats.streak > 0 ? `${stats.streak}-day streak!` : "Start your streak!"}
          </p>
          <p style={{ fontSize: 11, color: "rgba(0,0,0,0.65)" }}>Keep completing missions daily</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14, padding: "0 4px" }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #F5A623, #d89420)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Image src="/icon-profile.svg" alt="User" width={18} height={18} style={{ objectFit: "contain", filter: "brightness(0)" }} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#F5F5F5" }}>{stats.fullName || "Loading..."}</p>
            <p style={{ fontSize: 11, color: "#555555" }}>
              <span style={{ color: stats.badgeColor, fontWeight: 700 }}>{stats.levelName}</span>
              {stats.xp > 0 && <span style={{ color: "#F5A623" }}> &middot; {stats.xp.toLocaleString()} XP</span>}
            </p>
          </div>
          <button
            onClick={async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/login"); }}
            title="Log out"
            style={{ background: "rgba(229,62,62,0.1)", border: "1px solid rgba(229,62,62,0.2)", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
          >
            <Image src="/icon-password.svg" alt="Logout" width={14} height={14} style={{ opacity: 0.6, filter: "invert(40%) sepia(100%) saturate(500%) hue-rotate(320deg)" }} />
          </button>
        </div>
      </div>
    </aside>
  );
}
