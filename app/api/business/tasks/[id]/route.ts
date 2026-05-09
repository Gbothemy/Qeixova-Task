import { NextRequest, NextResponse } from "next/server";
import { getBusinessSession } from "@/lib/businessAuth";
import { sql } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getBusinessSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const taskRows = await sql`
    SELECT t.*,
      COUNT(c.id)::int AS total_completions,
      COUNT(CASE WHEN c.status = 'pending' THEN 1 END)::int AS pending_completions,
      COUNT(CASE WHEN c.status = 'approved' THEN 1 END)::int AS approved_completions,
      COUNT(CASE WHEN c.status = 'rejected' THEN 1 END)::int AS rejected_completions
    FROM tasks t
    LEFT JOIN completions c ON c.task_id = t.id
    WHERE t.id = ${Number(id)} AND t.business_id = ${session.businessId}
    GROUP BY t.id
  `;

  if (taskRows.length === 0) return NextResponse.json({ error: "Task not found" }, { status: 404 });

  const completions = await sql`
    SELECT c.id, c.status, c.completed_at, c.rejection_reason,
      u.full_name, u.email
    FROM completions c
    JOIN users u ON u.id = c.user_id
    WHERE c.task_id = ${Number(id)}
    ORDER BY c.completed_at DESC
    LIMIT 50
  `;

  return NextResponse.json({ task: taskRows[0], completions });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getBusinessSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { action } = await req.json();

  // Verify ownership
  const rows = await sql`SELECT id FROM tasks WHERE id = ${Number(id)} AND business_id = ${session.businessId}`;
  if (rows.length === 0) return NextResponse.json({ error: "Task not found" }, { status: 404 });

  if (action === "pause") {
    await sql`UPDATE tasks SET is_active = false WHERE id = ${Number(id)}`;
  } else if (action === "resume") {
    await sql`UPDATE tasks SET is_active = true WHERE id = ${Number(id)}`;
  } else if (action === "delete") {
    await sql`UPDATE tasks SET is_active = false, status = 'deleted' WHERE id = ${Number(id)}`;
  }

  return NextResponse.json({ ok: true });
}
