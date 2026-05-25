"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BusinessBottomNav from "@/components/BusinessBottomNav";
import BusinessSidebar from "@/components/BusinessSidebar";

type NotificationTone = "green" | "gold" | "blue" | "purple";

type NotificationStat = {
  label: string;
  value: number;
  tone: NotificationTone;
};

type BusinessNotification = {
  id: string;
  type: "approved" | "participation" | "verification" | "growth";
  title: string;
  body: string;
  status: string;
  tone: NotificationTone;
  created_at: string;
};

const filters = [
  "All",
  "My approved campaigns",
  "My approved participants",
  "My user verification",
  "My campaign growth",
];

export default function BusinessGrowthPage() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState("Business");
  const [notificationStats, setNotificationStats] = useState<NotificationStat[]>([]);
  const [notifications, setNotifications] = useState<BusinessNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadOwnerNotifications() {
      try {
        const [meRes, notificationsRes] = await Promise.all([
          fetch("/api/business/me"),
          fetch("/api/business/notifications"),
        ]);

        if (!meRes.ok || !notificationsRes.ok) {
          router.push("/business/login");
          return;
        }

        const [meData, notificationsData] = await Promise.all([
          meRes.json(),
          notificationsRes.json(),
        ]);

        if (!mounted) return;
        if (meData?.business?.name) setBusinessName(meData.business.name);
        setNotificationStats(notificationsData.stats ?? []);
        setNotifications(notificationsData.notifications ?? []);
        setUnreadCount(Number(notificationsData.unread ?? 0));
      } catch {
        router.push("/business/login");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadOwnerNotifications();
    return () => {
      mounted = false;
    };
  }, [router]);

  function formatNotificationDate(value: string) {
    if (!value) return "Recent";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Recent";
    return date.toLocaleString("en-NG", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <>
      <div className="notificationLayout">
        <BusinessSidebar name={businessName} />
        <main className="page-body business-page-pro notificationPage">
          <div className="businessWorkspace notificationWorkspace">
            <div className="businessAdsTopbar">
              <div className="businessAdsSearch">Search your campaign notifications, approvals, verification, growth</div>
              <div className="businessAdsActions">
                <Link href="/business/tasks">Campaigns</Link>
                <Link href="/business/tasks/new" className="primary">Create Campaign</Link>
              </div>
            </div>

            <section className="adsPanel notificationHero">
              <div>
                <p className="notificationEyebrow">{businessName} notifications</p>
                <h1 className="businessPageTitle">Your campaign activity</h1>
                <p>Track approvals, contributor participation approvals, user verification updates, and growth signals for campaigns owned by your business account.</p>
              </div>
              <div className="heroStatus">
                <span>Your unread updates</span>
                <strong>{unreadCount}</strong>
              </div>
            </section>

            <section className="notificationStats">
              {notificationStats.map((item) => (
                <article key={item.label} className={`adsPanel statCard ${item.tone}`}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </article>
              ))}
            </section>

            <section className="notificationGrid">
              <aside className="adsPanel filterPanel">
                <p className="notificationEyebrow">View</p>
                <div className="filterList">
                  {filters.map((filter, index) => (
                    <button key={filter} className={index === 0 ? "active" : ""} type="button">{filter}</button>
                  ))}
                </div>
              </aside>

              <section className="adsPanel notificationListPanel">
                <div className="sectionHead">
                  <div>
                    <p className="notificationEyebrow">Latest owner updates</p>
                    <h2>Your notifications</h2>
                  </div>
                  <button type="button">Mark all as read</button>
                </div>

                <div className="notificationList">
                  {loading ? (
                    <div className="emptyNotifications">
                      <strong>Loading your campaign notifications</strong>
                      <p>Checking campaigns, approved participation, verification updates, and growth signals owned by this business account.</p>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="emptyNotifications">
                      <strong>No campaign notifications yet</strong>
                      <p>When your campaigns receive approvals, contributor submissions, verification updates, or growth milestones, they will appear here.</p>
                    </div>
                  ) : (
                    notifications.map((item) => (
                      <article key={item.id} className={`notificationItem ${item.tone}`}>
                        <div className="notificationIcon">{item.type.slice(0, 2).toUpperCase()}</div>
                        <div>
                          <div className="notificationTitle">
                            <strong>{item.title}</strong>
                            <span>{formatNotificationDate(item.created_at)}</span>
                          </div>
                          <p>{item.body}</p>
                          <small>{item.status}</small>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </section>
            </section>
          </div>
        </main>
      </div>
      <BusinessBottomNav />
      <style>{styles}</style>
    </>
  );
}

const styles = `
  .notificationLayout {
    min-height: 100vh;
    background: #000;
  }

  .notificationPage {
    min-width: 0;
  }

  .notificationWorkspace {
    width: min(100%, 1440px);
    margin: 0 auto;
  }

  .notificationHero {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 220px;
    gap: 16px;
    align-items: center;
    padding: 22px;
    margin-bottom: 16px;
  }

  .notificationEyebrow {
    margin: 0 0 7px;
    color: #F5A623;
    font-size: 11px;
    font-weight: 950;
    letter-spacing: .9px;
    text-transform: uppercase;
  }

  .notificationHero h1 {
    margin: 0;
    font-size: clamp(34px, 4.4vw, 58px);
    line-height: 1.02;
  }

  .notificationHero p:not(.notificationEyebrow) {
    max-width: 760px;
    margin: 10px 0 0;
    color: #aaa;
    font-size: 14px;
    line-height: 1.65;
  }

  .heroStatus {
    padding: 16px;
    border: 1px solid rgba(245, 166, 35, .25);
    border-radius: 15px;
    background: rgba(245, 166, 35, .08);
    text-align: right;
  }

  .heroStatus span,
  .heroStatus strong {
    display: block;
  }

  .heroStatus span,
  .statCard span {
    color: #aaa;
    font-size: 11px;
    font-weight: 900;
    text-transform: uppercase;
  }

  .heroStatus strong {
    margin-top: 6px;
    color: #fff;
    font-size: 32px;
  }

  .notificationStats {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
    margin-bottom: 16px;
  }

  .statCard {
    padding: 17px;
    border-top: 3px solid #F5A623;
  }

  .statCard.green { border-top-color: #1AEF22; }
  .statCard.blue { border-top-color: #4a9eff; }
  .statCard.purple { border-top-color: #a855f7; }

  .statCard strong {
    display: block;
    margin-top: 10px;
    color: #F5F5F5;
    font-size: 30px;
    line-height: 1;
  }

  .notificationGrid {
    display: grid;
    grid-template-columns: 280px minmax(0, 1fr);
    gap: 16px;
    align-items: start;
  }

  .filterPanel,
  .notificationListPanel {
    padding: 18px;
  }

  .filterList {
    display: grid;
    gap: 9px;
  }

  .filterList button,
  .sectionHead button {
    border: 1px solid #222;
    border-radius: 12px;
    background: #0d0d0d;
    color: #bbb;
    cursor: pointer;
    font-weight: 800;
  }

  .filterList button {
    min-height: 44px;
    padding: 10px 12px;
    text-align: left;
  }

  .filterList button.active {
    border-color: rgba(245, 166, 35, .35);
    background: rgba(245, 166, 35, .1);
    color: #F5A623;
  }

  .sectionHead {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 14px;
    margin-bottom: 15px;
  }

  .sectionHead h2 {
    margin: 0;
    color: #F5F5F5;
    font-size: 22px;
  }

  .sectionHead button {
    padding: 10px 12px;
    color: #F5A623;
  }

  .notificationList {
    display: grid;
    gap: 10px;
  }

  .notificationItem {
    display: grid;
    grid-template-columns: 46px minmax(0, 1fr);
    gap: 13px;
    padding: 14px;
    border: 1px solid #1d1d1d;
    border-radius: 15px;
    background: #050505;
  }

  .notificationIcon {
    width: 46px;
    height: 46px;
    display: grid;
    place-items: center;
    border-radius: 14px;
    background: rgba(245, 166, 35, .12);
    color: #F5A623;
    font-size: 11px;
    font-weight: 950;
  }

  .notificationItem.green .notificationIcon {
    background: rgba(26, 239, 34, .1);
    color: #1AEF22;
  }

  .notificationItem.blue .notificationIcon {
    background: rgba(74, 158, 255, .12);
    color: #4a9eff;
  }

  .notificationItem.purple .notificationIcon {
    background: rgba(168, 85, 247, .12);
    color: #c084fc;
  }

  .notificationTitle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .notificationTitle strong {
    color: #F5F5F5;
    font-size: 14px;
  }

  .notificationTitle span {
    color: #777;
    font-size: 12px;
    white-space: nowrap;
  }

  .notificationItem p {
    margin: 6px 0 10px;
    color: #aaa;
    font-size: 13px;
    line-height: 1.55;
  }

  .notificationItem small {
    display: inline-flex;
    width: fit-content;
    padding: 4px 9px;
    border-radius: 999px;
    background: #111;
    color: #bbb;
    font-size: 11px;
    font-weight: 850;
  }

  .emptyNotifications {
    padding: 28px;
    border: 1px dashed rgba(245, 166, 35, .28);
    border-radius: 15px;
    background: rgba(245, 166, 35, .05);
  }

  .emptyNotifications strong {
    display: block;
    color: #F5F5F5;
    font-size: 16px;
  }

  .emptyNotifications p {
    max-width: 620px;
    margin: 8px 0 0;
    color: #999;
    font-size: 13px;
    line-height: 1.6;
  }

  @media (min-width: 1024px) {
    .notificationLayout {
      display: flex;
      align-items: flex-start;
    }

    .notificationPage {
      flex: 1;
      width: calc(100% - 260px);
    }
  }

  @media (max-width: 980px) {
    .notificationHero,
    .notificationGrid {
      grid-template-columns: 1fr;
    }

    .notificationStats {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .heroStatus {
      text-align: left;
    }
  }

  @media (max-width: 620px) {
    .notificationHero,
    .filterPanel,
    .notificationListPanel {
      padding: 16px;
    }

    .notificationStats {
      grid-template-columns: 1fr;
    }

    .sectionHead,
    .notificationTitle {
      align-items: flex-start;
      flex-direction: column;
    }
  }
`;
