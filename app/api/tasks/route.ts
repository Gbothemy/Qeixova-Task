import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Get user profile for targeting
    const userRows = await sql`
      SELECT profession, interests, platforms, age_range, gender, state
      FROM users WHERE id = ${session.userId}
    `;
    const user = userRows[0] ?? {};

    // Fetch all active tasks with completion status
    const tasks = await sql`
      SELECT
        t.id, t.title, t.category, t.reward, t.duration,
        t.icon, t.color,
        COALESCE(t.instructions, '') AS instructions,
        COALESCE(t.steps, '{}') AS steps,
        COALESCE(t.proof_type, 'screenshot') AS proof_type,
        COALESCE(t.proof_label, 'Upload screenshot as proof') AS proof_label,
        COALESCE(t.max_screenshots, 1) AS max_screenshots,
        COALESCE(t.total_budget, 0) AS total_budget,
        COALESCE(t.budget_used, 0) AS budget_used,
        COALESCE(t.task_link, '') AS task_link,
        COALESCE(t.target_professions, '{}') AS target_professions,
        COALESCE(t.target_interests, '{}') AS target_interests,
        COALESCE(t.target_platforms, '{}') AS target_platforms,
        COALESCE(t.target_age_ranges, '{}') AS target_age_ranges,
        COALESCE(t.target_genders, '{}') AS target_genders,
        COALESCE(t.target_states, '{}') AS target_states,
        CASE WHEN c.id IS NOT NULL THEN true ELSE false END AS completed
      FROM tasks t
      LEFT JOIN completions c
        ON c.task_id = t.id AND c.user_id = ${session.userId}
      WHERE t.is_active = true
        AND (t.total_budget = 0 OR t.budget_used < t.total_budget)
      ORDER BY completed ASC, t.reward DESC
    `;

    // Score each task by how well it matches the user's profile
    // Tasks with no targeting criteria are shown to everyone (score = 100)
    // Tasks with targeting criteria are scored by match percentage
    const scored = tasks.map((task: Record<string, unknown>) => {
      const criteria = [
        { targets: task.target_professions as string[], userVal: user.profession },
        { targets: task.target_age_ranges as string[], userVal: user.age_range },
        { targets: task.target_genders as string[], userVal: user.gender },
        { targets: task.target_states as string[], userVal: user.state },
      ];
      const arrayMatches = [
        { targets: task.target_interests as string[], userVals: (user.interests as string[]) ?? [] },
        { targets: task.target_platforms as string[], userVals: (user.platforms as string[]) ?? [] },
      ];

      // Count how many targeting criteria are set
      let totalCriteria = 0;
      let matchedCriteria = 0;

      for (const { targets, userVal } of criteria) {
        if (targets && targets.length > 0) {
          totalCriteria++;
          if (userVal && targets.includes(userVal)) matchedCriteria++;
        }
      }
      for (const { targets, userVals } of arrayMatches) {
        if (targets && targets.length > 0) {
          totalCriteria++;
          if (userVals.some((v: string) => targets.includes(v))) matchedCriteria++;
        }
      }

      // No targeting = show to everyone with full score
      const matchScore = totalCriteria === 0 ? 100 : Math.round((matchedCriteria / totalCriteria) * 100);

      // Hide tasks where user matches 0% of required criteria (only if criteria are set)
      const hidden = totalCriteria > 0 && matchedCriteria === 0;

      return { ...task, matchScore, hidden };
    });

    // Filter out hidden tasks, sort by: not completed first, then match score, then reward
    const visible = scored
      .filter((t: Record<string, unknown>) => !t.hidden)
      .sort((a: Record<string, unknown>, b: Record<string, unknown>) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        if ((b.matchScore as number) !== (a.matchScore as number)) return (b.matchScore as number) - (a.matchScore as number);
        return (b.reward as number) - (a.reward as number);
      });

    return NextResponse.json({ tasks: visible });
  } catch (err) {
    console.error("Tasks fetch error:", err);
    return NextResponse.json({ error: "Failed to load tasks" }, { status: 500 });
  }
}
