/**
 * Admin task management — protected by ADMIN_SECRET env var
 * 
 * GET  /api/admin/tasks          — list all tasks
 * POST /api/admin/tasks          — add a new task
 * PATCH /api/admin/tasks         — update a task (pass id + fields)
 * DELETE /api/admin/tasks        — deactivate a task (pass id)
 */
import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? "qeixova-admin-2025";

function checkAuth(req: NextRequest) {
  const key = req.headers.get("x-admin-key");
  return key === ADMIN_SECRET;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const tasks = await sql`
    SELECT *, COALESCE(mission_type, 'engagement') AS mission_type,
      COALESCE(xp_reward, 10) AS xp_reward,
      COALESCE(min_level, 1) AS min_level
    FROM tasks ORDER BY category, reward DESC
  `;
  return NextResponse.json({ tasks });
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, category, reward, duration, icon, color, instructions, steps, proof_type, proof_label, max_screenshots } = body;

  if (!title || !category || !reward) {
    return NextResponse.json({ error: "title, category and reward are required" }, { status: 400 });
  }

  const result = await sql`
    INSERT INTO tasks (title, category, reward, duration, icon, color, instructions, steps, proof_type, proof_label, max_screenshots, total_budget, task_link, mission_type, xp_reward, min_level)
    VALUES (
      ${title}, ${category}, ${reward},
      ${duration ?? "5 min"}, ${icon ?? "📋"}, ${color ?? "#e8f5e9"},
      ${instructions ?? ""}, ${steps ?? []}, ${proof_type ?? "screenshot"},
      ${proof_label ?? "Upload screenshot as proof"}, ${max_screenshots ?? 1},
      ${body.total_budget ?? 0}, ${body.task_link ?? ""},
      ${body.mission_type ?? "engagement"}, ${body.xp_reward ?? 10}, ${body.min_level ?? 1}
    )
    RETURNING id, title, category, reward, mission_type
  `;

  return NextResponse.json({ ok: true, task: result[0] });
}

export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, ...fields } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  // Build dynamic update — only update provided fields
  const allowed = ["title", "category", "reward", "duration", "icon", "color", "instructions", "steps", "proof_type", "proof_label", "max_screenshots", "is_active", "total_budget", "task_link", "mission_type", "xp_reward", "min_level"];
  for (const key of allowed) {
    if (fields[key] !== undefined) {
      if (key === "title")          await sql`UPDATE tasks SET title = ${fields[key]} WHERE id = ${id}`;
      else if (key === "category")  await sql`UPDATE tasks SET category = ${fields[key]} WHERE id = ${id}`;
      else if (key === "reward")    await sql`UPDATE tasks SET reward = ${fields[key]} WHERE id = ${id}`;
      else if (key === "duration")  await sql`UPDATE tasks SET duration = ${fields[key]} WHERE id = ${id}`;
      else if (key === "icon")      await sql`UPDATE tasks SET icon = ${fields[key]} WHERE id = ${id}`;
      else if (key === "color")     await sql`UPDATE tasks SET color = ${fields[key]} WHERE id = ${id}`;
      else if (key === "instructions") await sql`UPDATE tasks SET instructions = ${fields[key]} WHERE id = ${id}`;
      else if (key === "steps")     await sql`UPDATE tasks SET steps = ${fields[key]} WHERE id = ${id}`;
      else if (key === "proof_type") await sql`UPDATE tasks SET proof_type = ${fields[key]} WHERE id = ${id}`;
      else if (key === "proof_label") await sql`UPDATE tasks SET proof_label = ${fields[key]} WHERE id = ${id}`;
      else if (key === "max_screenshots") await sql`UPDATE tasks SET max_screenshots = ${fields[key]} WHERE id = ${id}`;
      else if (key === "total_budget")   await sql`UPDATE tasks SET total_budget = ${fields[key]} WHERE id = ${id}`;
      else if (key === "task_link")      await sql`UPDATE tasks SET task_link = ${fields[key]} WHERE id = ${id}`;
      else if (key === "is_active")      await sql`UPDATE tasks SET is_active = ${fields[key]} WHERE id = ${id}`;
      else if (key === "mission_type")   await sql`UPDATE tasks SET mission_type = ${fields[key]} WHERE id = ${id}`;
      else if (key === "xp_reward")      await sql`UPDATE tasks SET xp_reward = ${fields[key]} WHERE id = ${id}`;
      else if (key === "min_level")      await sql`UPDATE tasks SET min_level = ${fields[key]} WHERE id = ${id}`;
    }
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  // Soft delete — deactivate rather than destroy
  await sql`UPDATE tasks SET is_active = FALSE WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
