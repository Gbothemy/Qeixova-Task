"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const nav = [
  { href: "/business/dashboard", label: "Dashboard",   icon: "/icon-home.png",   desc: "Overview" },
  { href: "/business/tasks",     label: "My Tasks",    icon: "/icon-task.png",   desc: "Manage campaigns" },
  { href: "/business/tasks/new", label: "Create Task", icon: "/icon-content.png",desc: "Launch campaign" },
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
      <div style={{ padding: "28px 20px 20px", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Image src="/qeixova-icon.png" alt="Qeixova" width={38} height={38} style={{ borderRadius: 11, objectFit: "contain" }} />
          <div>
            <p style={{ fontWeight: 800, fontSize: 15, color: "#F5F5F5", letterSpacing: -0.5 }}>Qeixova</p>
            <p style={{ fontSize: 10, color: "#F5A623", fontWeight: 700, letterSpacing: 0.5 }}>BUSINESS PORTAL</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: "12px 10px", flex: 1 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: "#333", letterSpacing: 1.2, textTransform: "uppercase", padding: "8px 12px 4px" }}>Menu</p>
        {nav.map(item => {
          const active = path === item.href;
          return (
            <Link key={item.href} href={item.href} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 12px", borderRadius: 12, textDecoration: "none",
              background: active ? "rgba(245,166,35,0.1)" : "transparent",
              marginBottom: 2, transition: "background 0.15s",
              border: active ? "1px solid rgba(245,166,35,0.2)" : "1px solid transparent",
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                background: active ? "linear-gradient(135deg, #F5A623, #d89420)" : "#111",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: active ? "0 3px 10px rgba(245,166,35,0.3)" : "none",
              }}>
                <Image src={item.icon} alt={item.label} width={18} height={18}
                  style={{ objectFit: "contain", filter: active ? "brightness(0)" : "invert(50%) brightness(60%)" }} />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: active ? "#F5A623" : "#aaa" }}>{item.label}</p>
                <p style={{ fontSize: 11, color: "#444" }}>{item.desc}</p>
              </div>
              {active && <div style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: "50%", background: "#F5A623" }} />}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ padding: "14px 16px 20px", borderTop: "1px solid #1a1a1a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #F5A623, #d89420)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>🏢</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#F5F5F5", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</p>
            <p style={{ fontSize: 10, color: "#444" }}>Business account</p>
          </div>
          <button onClick={logout} title="Log out"
            style={{ background: "rgba(229,62,62,0.08)", border: "1px solid rgba(229,62,62,0.15)", borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 13, flexShrink: 0 }}>
            🚪
          </button>
        </div>
      </div>
    </aside>
  );
}
