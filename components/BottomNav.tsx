"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const nav = [
  { href: "/dashboard", label: "Home",     icon: "/icon-home.png" },
  { href: "/tasks",     label: "Missions", icon: "/icon-task.png" },
  { href: "/wallet",    label: "Wallet",   icon: "/icon-wallet.png" },
  { href: "/profile",   label: "Profile",  icon: "/icon-profile.png" },
];

export default function BottomNav() {
  const path = usePathname();
  return (
    <nav className="bottom-nav" style={{
      position: "fixed",
      bottom: 0, left: 0, right: 0,
      width: "100%",
      background: "#111111",
      borderTop: "1px solid #222222",
      display: "flex",
      zIndex: 50,
      boxShadow: "0 -4px 20px rgba(0,0,0,0.5)",
    }}>
      {nav.map((item) => {
        const active = path === item.href;
        return (
          <Link key={item.href} href={item.href} style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "10px 0 12px",
            textDecoration: "none",
            color: active ? "#1AEF22" : "#555555",
            fontSize: 10,
            fontWeight: active ? 700 : 500,
            gap: 3,
            letterSpacing: 0.3,
            position: "relative",
          }}>
            {active && (
              <div style={{
                position: "absolute",
                top: 0, left: "50%",
                transform: "translateX(-50%)",
                width: 32, height: 3,
                background: "linear-gradient(90deg, #1AEF22, #F5A623)",
                borderRadius: "0 0 4px 4px",
              }} />
            )}
            <Image
              src={item.icon}
              alt={item.label}
              width={24}
              height={24}
              style={{
                objectFit: "contain",
                filter: active
                  ? "invert(58%) sepia(98%) saturate(400%) hue-rotate(83deg) brightness(110%)"
                  : "invert(40%) sepia(0%) saturate(0%) brightness(60%)",
              }}
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
