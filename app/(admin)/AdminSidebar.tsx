"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "OV", desc: "Operations overview" },
  { href: "/admin/users", label: "Users", icon: "US", desc: "Contributor accounts" },
  { href: "/admin/tasks", label: "Missions", icon: "MS", desc: "Campaign inventory" },
  { href: "/admin/completions", label: "Submissions", icon: "RV", desc: "Proof review queue" },
  { href: "/admin/withdrawals", label: "Withdrawals", icon: "WD", desc: "Payout operations" },
  { href: "/admin/logs", label: "Audit Logs", icon: "LG", desc: "System activity" },
  { href: "/admin/config", label: "Economy", icon: "EC", desc: "Reward controls" },
];

function SidebarContent({
  pathname,
  onClose,
  onLogout,
}: {
  pathname: string;
  onClose: () => void;
  onLogout: () => void;
}) {
  return (
    <>
      <div className="adminBrand">
        <div className="adminBrandMark">Q</div>
        <div>
          <strong>Qeixova</strong>
          <span>Admin Control</span>
        </div>
        <button onClick={onClose} className="adminCloseButton" aria-label="Close admin menu">x</button>
      </div>

      <nav className="adminNav" aria-label="Admin navigation">
        <p>Operate</p>
        {NAV.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(`${item.href}/`));
          return (
            <Link key={item.href} href={item.href} onClick={onClose} className={active ? "active" : ""}>
              <span className="adminNavIcon">{item.icon}</span>
              <span className="adminNavCopy">
                <strong>{item.label}</strong>
                <small>{item.desc}</small>
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="adminSidebarFooter">
        <div>
          <span>Signed in as</span>
          <strong>Platform admin</strong>
        </div>
        <button onClick={onLogout}>Log out</button>
      </div>
    </>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin-login");
  }

  return (
    <>
      <div className="admin-topbar">
        <button onClick={() => setOpen(true)} aria-label="Open admin menu">Menu</button>
        <span>Qeixova Admin</span>
      </div>

      {open && <div className="admin-overlay" onClick={() => setOpen(false)} />}

      <aside className={`admin-sidebar${open ? " open" : ""}`}>
        <SidebarContent pathname={pathname} onClose={() => setOpen(false)} onLogout={handleLogout} />
      </aside>
    </>
  );
}
