import { NextResponse } from "next/server";
import { getBusinessSession } from "@/lib/businessAuth";
import { sql } from "@/lib/db";

type DbNotification = {
  id: string;
  type: "approved" | "participation" | "verification" | "growth";
  title: string;
  body: string;
  status: string;
  tone: "green" | "gold" | "blue" | "purple";
  created_at: string;
};

export async function GET() {
  const session = await getBusinessSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [statsRows, notificationRows] = await Promise.all([
    sql`
      WITH task_counts AS (
        SELECT
          t.id,
          t.is_active,
          t.task_status,
          t.target_completion_count,
          COUNT(c.id)::int AS total_submissions,
          COUNT(CASE WHEN c.status = 'approved' THEN 1 END)::int AS approved_submissions,
          COUNT(CASE WHEN c.status = 'pending' THEN 1 END)::int AS pending_submissions
        FROM tasks t
        LEFT JOIN completions c ON c.task_id = t.id
        WHERE t.business_id = ${session.businessId}
          AND COALESCE(t.task_status, '') <> 'deleted'
        GROUP BY t.id
      )
      SELECT
        COUNT(CASE WHEN is_active = TRUE OR COALESCE(task_status, '') IN ('active', 'live', 'approved') THEN 1 END)::int AS approvals,
        COALESCE(SUM(approved_submissions), 0)::int AS approved_participants,
        COALESCE(SUM(pending_submissions), 0)::int AS verification_updates,
        COUNT(
          CASE
            WHEN target_completion_count > 0
              AND approved_submissions >= GREATEST(1, CEIL(target_completion_count * 0.5)::int)
            THEN 1
          END
        )::int AS growth_milestones,
        COALESCE(SUM(pending_submissions), 0)::int AS unread
      FROM task_counts
    `,
    sql`
      WITH task_counts AS (
        SELECT
          t.id,
          t.title,
          t.category,
          t.created_at,
          t.is_active,
          t.task_status,
          t.target_completion_count,
          COUNT(c.id)::int AS total_submissions,
          COUNT(CASE WHEN c.status = 'approved' THEN 1 END)::int AS approved_submissions,
          COUNT(CASE WHEN c.status = 'pending' THEN 1 END)::int AS pending_submissions
        FROM tasks t
        LEFT JOIN completions c ON c.task_id = t.id
        WHERE t.business_id = ${session.businessId}
          AND COALESCE(t.task_status, '') <> 'deleted'
        GROUP BY t.id
      ),
      feed AS (
        SELECT
          ('campaign-' || id)::text AS id,
          'approved'::text AS type,
          'Campaign approved'::text AS title,
          ('Your campaign "' || title || '" is approved and available for contributor participation.')::text AS body,
          'Approved'::text AS status,
          'green'::text AS tone,
          created_at
        FROM task_counts
        WHERE is_active = TRUE OR COALESCE(task_status, '') IN ('active', 'live', 'approved')

        UNION ALL

        SELECT
          ('participation-' || c.id)::text AS id,
          'participation'::text AS type,
          'User participation approved'::text AS title,
          (COALESCE(u.full_name, 'A contributor') || ' was approved for "' || t.title || '". Reward release is now recorded.')::text AS body,
          'Approved'::text AS status,
          'gold'::text AS tone,
          c.completed_at AS created_at
        FROM completions c
        JOIN tasks t ON t.id = c.task_id
        LEFT JOIN users u ON u.id = c.user_id
        WHERE t.business_id = ${session.businessId}
          AND COALESCE(t.task_status, '') <> 'deleted'
          AND c.status = 'approved'

        UNION ALL

        SELECT
          ('verification-' || c.id)::text AS id,
          'verification'::text AS type,
          'User verification update'::text AS title,
          (COALESCE(u.full_name, 'A contributor') || ' submitted proof for "' || t.title || '". Review is pending.')::text AS body,
          'Needs review'::text AS status,
          'blue'::text AS tone,
          c.completed_at AS created_at
        FROM completions c
        JOIN tasks t ON t.id = c.task_id
        LEFT JOIN users u ON u.id = c.user_id
        WHERE t.business_id = ${session.businessId}
          AND COALESCE(t.task_status, '') <> 'deleted'
          AND c.status = 'pending'

        UNION ALL

        SELECT
          ('growth-' || id)::text AS id,
          'growth'::text AS type,
          'Campaign growth milestone'::text AS title,
          ('"' || title || '" has ' || approved_submissions || ' approved participant' ||
            CASE WHEN approved_submissions = 1 THEN '' ELSE 's' END ||
            CASE
              WHEN target_completion_count > 0 THEN ' out of ' || target_completion_count || ' target slots.'
              ELSE '.'
            END)::text AS body,
          'Growing'::text AS status,
          'purple'::text AS tone,
          created_at
        FROM task_counts
        WHERE approved_submissions > 0
      )
      SELECT id, type, title, body, status, tone, created_at
      FROM feed
      ORDER BY created_at DESC
      LIMIT 40
    `,
  ]);

  const stats = statsRows[0] ?? {};
  const notifications = notificationRows as DbNotification[];

  return NextResponse.json({
    unread: Number(stats.unread ?? 0),
    stats: [
      { label: "Your approvals", value: Number(stats.approvals ?? 0), tone: "green" },
      { label: "Your approved participants", value: Number(stats.approved_participants ?? 0), tone: "gold" },
      { label: "Your verification updates", value: Number(stats.verification_updates ?? 0), tone: "blue" },
      { label: "Your growth milestones", value: Number(stats.growth_milestones ?? 0), tone: "purple" },
    ],
    notifications,
  });
}
