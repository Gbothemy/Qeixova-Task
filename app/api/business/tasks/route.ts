import { NextRequest, NextResponse } from "next/server";
import { getBusinessSession } from "@/lib/businessAuth";
import { sql } from "@/lib/db";

export async function GET() {
  const session = await getBusinessSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tasks = await sql`
    SELECT
      t.*,
      COUNT(c.id)::int AS total_completions,
      COUNT(CASE WHEN c.status = 'pending' THEN 1 END)::int AS pending_completions,
      COUNT(CASE WHEN c.status = 'approved' THEN 1 END)::int AS approved_completions,
      COUNT(CASE WHEN c.status = 'rejected' THEN 1 END)::int AS rejected_completions
    FROM tasks t
    LEFT JOIN completions c ON c.task_id = t.id
    WHERE t.business_id = ${session.businessId}
    GROUP BY t.id
    ORDER BY t.created_at DESC
  `;

  return NextResponse.json({ tasks });
}

export async function POST(req: NextRequest) {
  const session = await getBusinessSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const {
    title, category, reward, duration, instructions, steps,
    proof_type, proof_label, max_screenshots, task_link,
    total_budget, target_completion_count,
    target_professions, target_interests, target_platforms,
    target_age_ranges, target_genders, target_states,
  } = await req.json();

  if (!title || !category || !reward) {
    return NextResponse.json({ error: "Title, category and reward are required" }, { status: 400 });
  }

  const result = await sql`
    INSERT INTO tasks (
      title, category, reward, duration, icon, color,
      instructions, steps, proof_type, proof_label, max_screenshots,
      task_link, total_budget, target_completion_count,
      target_professions, target_interests, target_platforms,
      target_age_ranges, target_genders, target_states,
      business_id, is_active, status
    ) VALUES (
      ${title}, ${category}, ${Number(reward)},
      ${duration || "5 min"}, ${"📋"}, ${"#111111"},
      ${instructions || ""}, ${steps || []},
      ${proof_type || "screenshot"}, ${proof_label || "Upload screenshot as proof"},
      ${max_screenshots || 1}, ${task_link || ""},
      ${Number(total_budget) || 0}, ${Number(target_completion_count) || 0},
      ${target_professions || []}, ${target_interests || []}, ${target_platforms || []},
      ${target_age_ranges || []}, ${target_genders || []}, ${target_states || []},
      ${session.businessId}, false, 'pending_review'
    )
    RETURNING id
  `;

  return NextResponse.json({ ok: true, taskId: result[0].id });
}
