"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/business/dashboard", label: "Home",   icon: "/icon-home.png" },
  { href: "/business/tasks",     label: "Tasks",  icon: "/icon-task.png" },
  { href: "/business/tasks/new", label: "Create", icon: "/icon-content.png" },
];

export default function BusinessBottomNav() {
  const path = usePathname();
  return (
    <nav className="bottom-nav" style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: "#0a0a0a", borderTop: "1px solid #1a1a1a",
      display: "flex", zIndex: 50,
      boxShadow: "0 -4px 24px rgba(0,0,0,0.6)",
    }}>
      {nav.map(item => {
        const active = path === item.href;
        return (
          <Link key={item.href} href={item.href} style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", padding: "10px 0 12px",
            textDecoration: "none",
            color: active ? "#F5A623" : "#444",
            fontSize: 10, fontWeight: active ? 700 : 500,
            gap: 4, position: "relative",
          }}>
            {active && (
              <div style={{
                position: "absolute", top: 0, left: "50%",
                transform: "translateX(-50%)",
                width: 28, height: 3,
                background: "linear-gradient(90deg, #F5A623, #d89420)",
                borderRadius: "0 0 4px 4px",
              }} />
            )}
            <Image src={item.icon} alt={item.label} width={22} height={22}
              style={{
                objectFit: "contain",
                filter: active
                  ? "invert(72%) sepia(60%) saturate(500%) hue-rotate(5deg) brightness(105%)"
                  : "invert(30%) brightness(50%)",
              }} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
