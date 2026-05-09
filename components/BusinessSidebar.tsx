"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const nav = [
  { href: "/business/dashboard", label: "Dashboard", icon: "📊", desc: "Overview" },
  { href: "/business/tasks",     label: "My Tasks",  icon: "📋", desc: "Manage tasks" },
  { href: "/business/tasks/new", label: "Create Task", icon: "➕", desc: "Launch campaign" },
];

export default function BusinessSidebar({ name }: { name: string }) {
  const path = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/business/logout", { method: "POST" });
    router.push("/business/login");
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div style={{ padding: "32px 24px 24px", borderBottom: "1px solid #222222" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #F5A623, #d89420)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🏢</div>
          <div>
            <p style={{ fontWeight: 800, fontSize: 16, color: "#F5F5F5", letterSpacing: -0.5 }}>Qeixova</p>
            <p style={{ fontSize: 11, color: "#555555" }}>Business Portal</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: "12px 12px", flex: 1 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: "#444444", letterSpacing: 1.2, textTransform: "uppercase", padding: "8px 12px 4px" }}>Menu</p>
        {nav.map(item => {
          const active = path === item.href;
          return (
            <Link key={item.href} href={item.href} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "11px 14px", borderRadius: 12, textDecoration: "none",
              background: active ? "rgba(245,166,35,0.1)" : "transparent",
              marginBottom: 2, transition: "background 0.15s",
              border: active ? "1px solid rgba(245,166,35,0.25)" : "1px solid transparent",
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: active ? "linear-gradient(135deg, #F5A623, #d89420)" : "#1a1a1a",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, flexShrink: 0,
                boxShadow: active ? "0 3px 10px rgba(245,166,35,0.3)" : "none",
              }}>
                {item.icon}
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: active ? 700 : 500, color: active ? "#F5A623" : "#cccccc" }}>{item.label}</p>
                <p style={{ fontSize: 11, color: "#555555" }}>{item.desc}</p>
              </div>
              {active && <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#F5A623" }} />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "16px 20px 24px", borderTop: "1px solid #222222" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 4px" }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #F5A623, #d89420)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🏢</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#F5F5F5", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</p>
            <p style={{ fontSize: 11, color: "#555555" }}>Business account</p>
          </div>
          <button onClick={logout} title="Log out"
            style={{ background: "rgba(229,62,62,0.1)", border: "1px solid rgba(229,62,62,0.2)", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 15, flexShrink: 0 }}>
            🚪
          </button>
        </div>
      </div>
    </aside>
  );
}
