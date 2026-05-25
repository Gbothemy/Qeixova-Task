"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/business/dashboard", label: "Overview", icon: "/icon-home.svg" },
  { href: "/business/tasks", label: "Campaigns", icon: "/icon-task.svg" },
  { href: "/business/tasks/new", label: "Create", icon: "/icon-content.svg" },
  { href: "/business/wallet", label: "Billing", icon: "/icon-wallet.svg" },
  { href: "/business/growth", label: "Alerts", icon: "/icon-analytics.svg" },
];

export default function BusinessBottomNav() {
  const path = usePathname();
  return (
    <nav className="businessMobileNav bottom-nav" aria-label="Business mobile navigation">
      {nav.map((item) => {
        const active = path === item.href || (item.href === "/business/tasks" && path.startsWith("/business/tasks/") && path !== "/business/tasks/new");
        return (
          <Link key={item.href} href={item.href} className={active ? "active" : ""}>
            <Image src={item.icon} alt="" width={19} height={19} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
