"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const nav = [
  { href: "/business/dashboard", label: "Overview", icon: "/icon-home.svg", desc: "Account health" },
  { href: "/business/tasks", label: "Campaigns", icon: "/icon-task.svg", desc: "Campaign manager" },
  { href: "/business/tasks/new", label: "Create", icon: "/icon-content.svg", desc: "Guided campaign setup" },
  { href: "/business/wallet", label: "Billing", icon: "/icon-wallet.svg", desc: "Credits and spend" },
  { href: "/business/growth", label: "Growth Hub", icon: "/icon-analytics.svg", desc: "Strategy map" },
];

function isActivePath(path: string, href: string) {
  if (href === "/business/tasks") return path === href || (path.startsWith("/business/tasks/") && path !== "/business/tasks/new");
  return path === href;
}

export default function BusinessSidebar({ name }: { name: string }) {
  const path = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/business/logout", { method: "POST" });
    router.push("/business/login");
  };

  return (
    <aside className="businessAdsSidebar">
      <div className="businessAdsBrand">
        <Link href="/business/dashboard" className="businessAdsLogo">
          <Image src="/qeixova-icon.png" alt="Qeixova" width={36} height={36} />
          <div>
            <strong>Qeixova</strong>
            <span>Business Manager</span>
          </div>
        </Link>
        <Link href="/business/tasks/new" className="businessCreateButton">
          <Image src="/icon-create-mission.svg" alt="" width={15} height={15} />
          Create Campaign
        </Link>
      </div>

      <div className="businessAccountBox">
        <div className="businessAvatar">{name.slice(0, 1).toUpperCase()}</div>
        <div>
          <span>Ad account</span>
          <strong>{name}</strong>
        </div>
      </div>

      <nav className="businessAdsNav" aria-label="Business navigation">
        <p>Manage</p>
        {nav.map((item) => {
          const active = isActivePath(path, item.href);
          return (
            <Link key={item.href} href={item.href} className={active ? "active" : ""}>
              <span className="navIcon">
                <Image src={item.icon} alt="" width={18} height={18} />
              </span>
              <span className="navCopy">
                <strong>{item.label}</strong>
                <small>{item.desc}</small>
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="businessSidebarFoot">
        <div>
          <span>Status</span>
          <strong>Ready to launch</strong>
        </div>
        <button type="button" onClick={logout}>Logout</button>
      </div>
    </aside>
  );
}
