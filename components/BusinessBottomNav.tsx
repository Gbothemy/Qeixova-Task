"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/business/dashboard", label: "Home",     icon: "/icon-home.svg" },
  { href: "/business/tasks",     label: "Campaigns", icon: "/icon-task.svg" },
  { href: "/business/tasks/new", label: "Create",   icon: "/icon-content.svg" },
  { href: "/business/wallet",    label: "Funding",  icon: "/icon-wallet.svg" },
  { href: "/business/growth",    label: "Growth",   icon: "/icon-analytics.svg" },
];

export default function BusinessBottomNav() {
  const path = usePathname();
  return (
    <nav className="bottom-nav" style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: "#080808", borderTop: "1px solid #1a1a1a",
      display: "flex", zIndex: 50,
      boxShadow: "0 -8px 32px rgba(0,0,0,0.7)",
    }}>
      {nav.map(item => {
        const active = path === item.href;
        return (
          <Link key={item.href} href={item.href} style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", padding: "10px 0 13px",
            textDecoration: "none",
            color: active ? "#F5A623" : "#3a3a3a",
            fontSize: 10, fontWeight: active ? 700 : 500,
            gap: 4, position: "relative", letterSpacing: 0.3,
          }}>
            {active && (
              <div style={{
                position: "absolute", top: 0, left: "50%",
                transform: "translateX(-50%)",
                width: 32, height: 3,
                background: "linear-gradient(90deg, #F5A623, #d89420)",
                borderRadius: "0 0 6px 6px",
              }} />
            )}
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: active ? "rgba(245,166,35,0.12)" : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.15s",
            }}>
              <Image src={item.icon} alt={item.label} width={18} height={18}
                style={{
                  objectFit: "contain",
                  filter: active
                    ? "invert(72%) sepia(60%) saturate(500%) hue-rotate(5deg) brightness(105%)"
                    : "invert(25%) brightness(45%)",
                }} />
            </div>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
