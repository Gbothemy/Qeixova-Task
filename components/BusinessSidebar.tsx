"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const nav = [
  { href: "/business/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/business/tasks", label: "My Tasks", icon: "📋" },
  { href: "/business/tasks/new", label: "Create Task", icon: "➕" },
];

export default function BusinessSidebar({ name }: { name: string }) {
  const path = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/business/logout", { method: "POST" });
    router.push("/business/login");
  };

  return (
    <aside style={{ width: 240, background: "#0a0a0a", borderRight: "1px solid #222222", minHeight: "100vh", display: "flex", flexDirection: "column", padding: "24px 16px", flexShrink: 0 }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32, padding: "0 8px" }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #1AEF22, #06B517)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🏢</div>
        <div>
          <p style={{ fontWeight: 800, fontSize: 14, color: "#F5F5F5" }}>Qeixova</p>
          <p style={{ fontSize: 11, color: "#555555" }}>Business Portal</p>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
        {nav.map(item => {
          const active = path === item.href;
          return (
            <Link key={item.href} href={item.href} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
              borderRadius: 10, textDecoration: "none",
              background: active ? "rgba(26,239,34,0.1)" : "transparent",
              border: active ? "1px solid rgba(26,239,34,0.2)" : "1px solid transparent",
              color: active ? "#1AEF22" : "#888888",
              fontWeight: active ? 700 : 500, fontSize: 14,
            }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ borderTop: "1px solid #222222", paddingTop: 16, marginTop: 16 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#F5F5F5", marginBottom: 4, padding: "0 8px" }}>{name}</p>
        <button onClick={logout} style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "none", background: "rgba(229,62,62,0.08)", color: "#e53e3e", fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "left" }}>
          🚪 Log Out
        </button>
      </div>
    </aside>
  );
}
