"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const nav = [
  { href: "/business/dashboard", label: "Dashboard",    icon: "/icon-home.svg",    desc: "Overview & stats" },
  { href: "/business/tasks",     label: "Campaigns",    icon: "/icon-task.svg",    desc: "Manage missions" },
  { href: "/business/tasks/new", label: "Create",       icon: "/icon-content.svg", desc: "Launch campaign" },
];

export default function BusinessSidebar({ name }: { name: string }) {
  const path = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/business/logout", { method: "POST" });
    router.push("/business/login");
  };

  return (
    <aside className="sidebar" style={{ background: "#080808", borderRight: "1px solid #1a1a1a" }}>
      {/* Brand */}
      <div style={{ padding: "28px 22px 22px", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <Image src="/qeixova-icon.png" alt="Qeixova" width={40} height={40} style={{ borderRadius: 12, objectFit: "contain" }} />
          <div>
            <p style={{ fontWeight: 800, fontSize: 16, color: "#F5F5F5", letterSpacing: -0.5, lineHeight: 1.2 }}>Qeixova</p>
            <p style={{ fontSize: 10, color: "#F5A623", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>Business</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: "16px 12px", flex: 1 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: "#2a2a2a", letterSpacing: 1.5, textTransform: "uppercase", padding: "0 10px 10px" }}>Navigation</p>
        {nav.map(item => {
          const active = path === item.href || (item.href !== "/business/dashboard" && path.startsWith(item.href) && item.href !== "/business/tasks/new") || (item.href === "/business/tasks/new" && path === "/business/tasks/new");
          const isActive = path === item.href;
          return (
            <Link key={item.href} href={item.href} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 12px", borderRadius: 12, textDecoration: "none",
              background: isActive ? "rgba(245,166,35,0.1)" : "transparent",
              marginBottom: 3,
              border: isActive ? "1px solid rgba(245,166,35,0.18)" : "1px solid transparent",
              transition: "all 0.15s",
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: isActive ? "linear-gradient(135deg, #F5A623, #d89420)" : "#111",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: isActive ? "0 4px 12px rgba(245,166,35,0.25)" : "none",
              }}>
                <Image src={item.icon} alt={item.label} width={18} height={18}
                  style={{ objectFit: "contain", filter: isActive ? "brightness(0)" : "invert(40%) brightness(60%)" }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: isActive ? 700 : 500, color: isActive ? "#F5A623" : "#999", lineHeight: 1.2 }}>{item.label}</p>
                <p style={{ fontSize: 10, color: "#999", marginTop: 1 }}>{item.desc}</p>
              </div>
              {isActive && <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#F5A623", flexShrink: 0 }} />}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div style={{ padding: "14px 16px 22px", borderTop: "1px solid #1a1a1a" }}>
        <div style={{ background: "#0d0d0d", borderRadius: 12, padding: "12px 14px", border: "1px solid #1a1a1a", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #F5A623, #d89420)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Image src="/icon-profile.svg" alt="Business" width={18} height={18} style={{ objectFit: "contain", filter: "brightness(0)" }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#F5F5F5", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</p>
            <p style={{ fontSize: 10, color: "#aaa" }}>Business account</p>
          </div>
          <button onClick={logout} title="Log out"
            style={{ background: "rgba(229,62,62,0.08)", border: "1px solid rgba(229,62,62,0.12)", borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
            <Image src="/icon-password.svg" alt="Logout" width={14} height={14} style={{ opacity: 0.6, filter: "invert(40%) sepia(100%) saturate(500%) hue-rotate(320deg)" }} />
          </button>
        </div>
      </div>
    </aside>
  );
}
