import { NextResponse } from "next/server";
import { getBusinessSession } from "@/lib/businessAuth";
import { sql } from "@/lib/db";

export async function GET() {
  const session = await getBusinessSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [tasks, completions] = await Promise.all([
    sql`
      SELECT
        COUNT(*)::int AS total,
        COUNT(CASE WHEN is_active AND COALESCE(status, 'active') = 'active' THEN 1 END)::int AS active
      FROM tasks
      WHERE business_id = ${session.businessId}
        AND COALESCE(status, '') <> 'deleted'
    `,
    sql`
      SELECT
        COUNT(c.id)::int AS total,
        COUNT(CASE WHEN c.status = 'pending' THEN 1 END)::int AS pending,
        COUNT(CASE WHEN c.status = 'approved' THEN 1 END)::int AS approved,
        COUNT(CASE WHEN c.status = 'rejected' THEN 1 END)::int AS rejected,
        COALESCE(SUM(CASE WHEN c.status = 'approved' THEN t.reward ELSE 0 END), 0)::int AS total_qlt_spent
      FROM completions c
      JOIN tasks t ON t.id = c.task_id
      WHERE t.business_id = ${session.businessId}
    `,
  ]);

  return NextResponse.json({
    tasks: tasks[0],
    completions: completions[0],
  });
}
