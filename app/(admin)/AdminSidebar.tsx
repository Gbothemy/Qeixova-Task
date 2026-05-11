"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const NAV = [
  { href: "/admin",             label: "Dashboard",   icon: "📊" },
  { href: "/admin/users",       label: "Users",       icon: "👥" },
  { href: "/admin/tasks",       label: "Missions",    icon: "📋" },
  { href: "/admin/withdrawals", label: "Withdrawals", icon: "💸" },
  { href: "/admin/completions", label: "Submissions",  icon: "✅" },
  { href: "/admin/logs",        label: "Audit Logs",  icon: "🔍" },
  { href: "/admin/config",      label: "Economy",     icon: "⚙️" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const [open, setOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => { setOpen(false); }, [pathname]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin-login");
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div style={{ padding: "28px 24px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ color: "#F5A623", fontWeight: 700, fontSize: 20, letterSpacing: 1 }}>Qeixova</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginTop: 2 }}>Admin Portal</div>
          </div>
          {/* Close button — mobile only */}
          <button onClick={() => setOpen(false)}
            style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 22, cursor: "pointer", display: "none" }}
            className="admin-close-btn">
            ✕
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 0" }}>
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 24px",
              color: active ? "#F5A623" : "rgba(255,255,255,0.65)",
              background: active ? "rgba(245,166,35,0.1)" : "transparent",
              borderLeft: active ? "3px solid #F5A623" : "3px solid transparent",
              textDecoration: "none", fontSize: 14,
              fontWeight: active ? 600 : 400,
              transition: "all 0.15s",
            }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <button onClick={handleLogout} style={{
          width: "100%", padding: "10px 16px",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 8, color: "rgba(255,255,255,0.6)",
          cursor: "pointer", fontSize: 13, textAlign: "left",
        }}>
          🚪 Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="admin-topbar">
        <button onClick={() => setOpen(true)} style={{
          background: "none", border: "none", color: "#F5A623",
          fontSize: 24, cursor: "pointer", lineHeight: 1,
        }}>☰</button>
        <span style={{ color: "#F5A623", fontWeight: 700, fontSize: 16 }}>Qeixova Admin</span>
      </div>

      {/* Overlay */}
      {open && (
        <div className="admin-overlay" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar${open ? " open" : ""}`}
        style={{ display: "flex", flexDirection: "column" }}>
        <SidebarContent />
      </aside>
    </>
  );
}

