"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/business/dashboard", label: "Home",   icon: "📊" },
  { href: "/business/tasks",     label: "Tasks",  icon: "📋" },
  { href: "/business/tasks/new", label: "Create", icon: "➕" },
];

export default function BusinessBottomNav() {
  const path = usePathname();
  return (
    <nav className="bottom-nav" style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: "#111111", borderTop: "1px solid #222222",
      display: "flex", zIndex: 50,
      boxShadow: "0 -4px 20px rgba(0,0,0,0.5)",
    }}>
      {nav.map(item => {
        const active = path === item.href;
        return (
          <Link key={item.href} href={item.href} style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", padding: "10px 0 12px",
            textDecoration: "none",
            color: active ? "#F5A623" : "#555555",
            fontSize: 10, fontWeight: active ? 700 : 500,
            gap: 3, letterSpacing: 0.3, position: "relative",
          }}>
            {active && (
              <div style={{
                position: "absolute", top: 0, left: "50%",
                transform: "translateX(-50%)",
                width: 32, height: 3,
                background: "linear-gradient(90deg, #F5A623, #1AEF22)",
                borderRadius: "0 0 4px 4px",
              }} />
            )}
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
