import Link from "next/link";
import type { CSSProperties } from "react";
import { getAdminSession } from "@/lib/adminAuth";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import DataManagement from "../DataManagement";

async function getStats() {
  const [
    users, newUsersToday,
    completionsTotal, completionsToday, pendingCompletions,
    qltAwarded, qltToday,
    withdrawalsPending, withdrawalsProcessing, withdrawalsTotal,
    activeTasks,
  ] = await Promise.all([
    sql`SELECT COUNT(*)::int AS count FROM users`,
    sql`SELECT COUNT(*)::int AS count FROM users WHERE DATE(created_at) = CURRENT_DATE`,
    sql`SELECT COUNT(*)::int AS count FROM completions`,
    sql`SELECT COUNT(*)::int AS count FROM completions WHERE DATE(completed_at) = CURRENT_DATE`,
    sql`SELECT COUNT(*)::int AS count FROM completions WHERE status = 'pending'`,
    sql`SELECT COALESCE(SUM(amount),0)::bigint AS total FROM transactions WHERE type='credit' AND label LIKE 'Task%'`,
    sql`SELECT COALESCE(SUM(t.reward),0)::bigint AS total FROM completions c JOIN tasks t ON t.id = c.task_id WHERE c.status = 'approved' AND DATE(c.completed_at) = CURRENT_DATE`,
    sql`SELECT COUNT(*)::int AS count, COALESCE(SUM(amount),0)::bigint AS total FROM transactions WHERE type='debit' AND status='pending'`,
    sql`SELECT COUNT(*)::int AS count FROM transactions WHERE type='debit' AND status='processing'`,
    sql`SELECT COALESCE(SUM(amount),0)::bigint AS total FROM transactions WHERE type='debit' AND status='completed'`,
    sql`SELECT COUNT(*)::int AS count FROM tasks WHERE is_active=true`,
  ]);

  return {
    totalUsers: users[0].count,
    newUsersToday: newUsersToday[0].count,
    completionsTotal: completionsTotal[0].count,
    completionsToday: completionsToday[0].count,
    pendingCompletions: pendingCompletions[0].count,
    qltAwarded: Number(qltAwarded[0].total),
    qltToday: Number(qltToday[0].total),
    withdrawalsPending: withdrawalsPending[0].count,
    withdrawalsPendingAmount: Number(withdrawalsPending[0].total),
    withdrawalsProcessing: withdrawalsProcessing[0].count,
    withdrawalsTotal: Number(withdrawalsTotal[0].total),
    activeTasks: activeTasks[0].count,
  };
}

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return n.toLocaleString();
}

function currencyFromKobo(amount: number) {
  return `N${(amount / 100).toLocaleString()}`;
}

function StatCard({
  label,
  value,
  sub,
  accent,
  alert,
}: {
  label: string;
  value: string;
  sub?: string;
  accent: string;
  alert?: boolean;
}) {
  return (
    <div className={`adminStatCard${alert ? " alert" : ""}`} style={{ "--accent": accent } as CSSProperties}>
      <span>{label}</span>
      <strong>{value}</strong>
      {sub && <p>{sub}</p>}
    </div>
  );
}

export default async function AdminDashboard() {
  const isAdmin = await getAdminSession();
  if (!isAdmin) redirect("/admin-login");

  const s = await getStats();
  const pendingActions = s.pendingCompletions + s.withdrawalsPending;
  const reviewLoad = s.completionsTotal > 0 ? Math.min(100, Math.round((s.pendingCompletions / s.completionsTotal) * 100)) : 0;
  const payoutLoad = s.withdrawalsPending + s.withdrawalsProcessing;

  return (
    <div className="adminPage">
      <section className="adminPageHeader">
        <div className="adminHero">
          <p className="adminEyebrow">Platform operations</p>
          <h1>Admin Command Center</h1>
          <p>
            Monitor Qeixova contributors, campaign activity, proof reviews, rewards, withdrawals,
            and operational controls from one focused workspace.
          </p>
        </div>

        <aside className="adminStatusCard">
          <span>Pending actions</span>
          <strong>{pendingActions.toLocaleString()}</strong>
          <p>
            {pendingActions > 0
              ? "Review queues need attention before the platform can run cleanly."
              : "All critical review queues are clear right now."}
          </p>
        </aside>
      </section>

      {pendingActions > 0 && (
        <div className="adminAlert">
          {s.pendingCompletions > 0 && (
            <span>{s.pendingCompletions} submission{s.pendingCompletions !== 1 ? "s" : ""} awaiting proof review</span>
          )}
          {s.withdrawalsPending > 0 && (
            <span>{s.withdrawalsPending} withdrawal{s.withdrawalsPending !== 1 ? "s" : ""} pending ({currencyFromKobo(s.withdrawalsPendingAmount)})</span>
          )}
        </div>
      )}

      <section>
        <div className="adminSectionTitle">
          <div>
            <h2>Live Overview</h2>
            <p>Current platform health across contributors, missions, and payout movement.</p>
          </div>
        </div>
        <div className="adminGrid">
          <StatCard label="Total Contributors" value={s.totalUsers.toLocaleString()} sub={`+${s.newUsersToday} joined today`} accent="#1AEF22" />
          <StatCard label="Active Missions" value={s.activeTasks.toLocaleString()} sub="Visible to contributors" accent="#F5A623" />
          <StatCard label="Total Submissions" value={s.completionsTotal.toLocaleString()} sub={`${s.completionsToday} submitted today`} accent="#3B82F6" />
          <StatCard label="Pending Review" value={s.pendingCompletions.toLocaleString()} sub="Proofs needing action" accent="#F97316" alert={s.pendingCompletions > 0} />
          <StatCard label="QLT Awarded" value={`${fmt(s.qltAwarded)} QLT`} sub={`${fmt(s.qltToday)} QLT approved today`} accent="#22C55E" />
          <StatCard label="Pending Withdrawals" value={s.withdrawalsPending.toLocaleString()} sub={currencyFromKobo(s.withdrawalsPendingAmount)} accent="#EF4444" alert={s.withdrawalsPending > 0} />
          <StatCard label="Processing Payouts" value={s.withdrawalsProcessing.toLocaleString()} sub={`${payoutLoad} total payout items open`} accent="#8B5CF6" />
          <StatCard label="Total Paid Out" value={currencyFromKobo(s.withdrawalsTotal)} sub="Completed withdrawal value" accent="#0EA5E9" />
        </div>
      </section>

      <section className="adminGrid">
        <div className="adminPanel wide">
          <div className="adminSectionTitle">
            <div>
              <h2>Operations Pulse</h2>
              <p>Quick read on the queues that affect trust, reward release, and campaign quality.</p>
            </div>
          </div>
          <div className="adminList">
            <div className="adminListItem">
              <div>
                <strong>Proof review load</strong>
                <span>{s.pendingCompletions} pending from {s.completionsTotal} total submissions</span>
              </div>
              <strong>{reviewLoad}%</strong>
            </div>
            <div className="adminBar" aria-label="Proof review load">
              <span style={{ width: `${reviewLoad}%` }} />
            </div>
            <div className="adminListItem">
              <div>
                <strong>Today&apos;s approved reward movement</strong>
                <span>Rewards connected to approved contributor participation today</span>
              </div>
              <strong>{fmt(s.qltToday)} QLT</strong>
            </div>
            <div className="adminListItem">
              <div>
                <strong>Withdrawal queue</strong>
                <span>Pending and processing payout requests</span>
              </div>
              <strong>{payoutLoad.toLocaleString()}</strong>
            </div>
          </div>
        </div>

        <div className="adminPanel side">
          <div className="adminSectionTitle">
            <div>
              <h2>Fast Actions</h2>
              <p>Jump into the areas that usually need admin attention.</p>
            </div>
          </div>
          <div className="adminQuickActions">
            <Link href="/admin/completions" className="adminActionCard">
              <strong>Review submissions</strong>
              <span>Approve, reject, or request correction for proof.</span>
            </Link>
            <Link href="/admin/withdrawals" className="adminActionCard">
              <strong>Manage withdrawals</strong>
              <span>Process pending contributor payout requests.</span>
            </Link>
            <Link href="/admin/tasks" className="adminActionCard">
              <strong>Audit missions</strong>
              <span>Check active campaign inventory and availability.</span>
            </Link>
            <Link href="/admin/config" className="adminActionCard">
              <strong>Economy controls</strong>
              <span>Adjust reward and platform configuration values.</span>
            </Link>
          </div>
        </div>
      </section>

      <DataManagement />
    </div>
  );
}
