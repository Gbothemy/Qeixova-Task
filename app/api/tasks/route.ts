import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Get user profile + level info for targeting and cap enforcement
    const userRows = await sql`
      SELECT u.profession, u.interests, u.platforms, u.age_range, u.gender, u.state,
             u.xp, u.trust_score, u.daily_earned, u.daily_reset_at,
             l.level_number, l.daily_cap_qlt, l.name AS level_name, l.badge_color,
             l.unlock_features
      FROM users u
      LEFT JOIN levels l ON l.id = u.level_id
      WHERE u.id = ${session.userId}
    `;
    const user = userRows[0] ?? {};

    // Reset daily cap if new day
    const today = new Date().toISOString().split("T")[0];
    if (user.daily_reset_at && new Date(user.daily_reset_at).toISOString().split("T")[0] < today) {
      await sql`UPDATE users SET daily_earned = 0, daily_reset_at = ${today} WHERE id = ${session.userId}`;
      user.daily_earned = 0;
    }

    const userLevelNum = Number(user.level_number ?? 1);
    const unlockedTypes: string[] = (user.unlock_features as string[]) ?? ["engagement_missions"];

    // Build allowed mission types based on level unlocks
    const allowedMissionTypes: string[] = [];
    if (unlockedTypes.includes("engagement_missions"))    allowedMissionTypes.push("engagement");
    if (unlockedTypes.includes("participation_missions")) allowedMissionTypes.push("participation");
    if (unlockedTypes.includes("premium_missions"))       allowedMissionTypes.push("premium");

    // Fetch active missions with completion status
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
        COALESCE(t.mission_type, 'engagement') AS mission_type,
        COALESCE(t.xp_reward, 10) AS xp_reward,
        COALESCE(t.verification_type, t.proof_type, 'screenshot') AS verification_type,
        COALESCE(t.difficulty, 'easy') AS difficulty,
        COALESCE(t.min_level, 1) AS min_level,
        COALESCE(t.estimated_time, t.duration, '5 min') AS estimated_time,
        COALESCE(t.target_professions, '{}') AS target_professions,
        COALESCE(t.target_interests, '{}') AS target_interests,
        COALESCE(t.target_platforms, '{}') AS target_platforms,
        COALESCE(t.target_age_ranges, '{}') AS target_age_ranges,
        COALESCE(t.target_genders, '{}') AS target_genders,
        COALESCE(t.target_states, '{}') AS target_states,
        CASE WHEN c.id IS NOT NULL THEN true ELSE false END AS completed,
        c.status AS completion_status
      FROM tasks t
      LEFT JOIN completions c ON c.task_id = t.id AND c.user_id = ${session.userId}
      WHERE t.is_active = true
        AND COALESCE(t.task_status, 'active') = 'active'
        AND (t.total_budget = 0 OR t.budget_used < t.total_budget)
      ORDER BY t.reward DESC
    `;

    const dailyEarned = Number(user.daily_earned ?? 0);
    const dailyCap = Number(user.daily_cap_qlt ?? 5000);
    const dailyRemaining = Math.max(0, dailyCap - dailyEarned);

    // Score + filter tasks
    const scored = tasks.map((task: Record<string, unknown>) => {
      // Level gate
      const minLevel = Number(task.min_level ?? 1);
      const lockedByLevel = userLevelNum < minLevel;

      // Mission type gate
      const mType = task.mission_type as string;
      const lockedByType = !allowedMissionTypes.includes(mType);

      // Targeting score
      const criteria = [
        { targets: task.target_professions as string[], userVal: user.profession },
        { targets: task.target_age_ranges as string[],  userVal: user.age_range },
        { targets: task.target_genders as string[],     userVal: user.gender },
        { targets: task.target_states as string[],      userVal: user.state },
      ];
      const arrayMatches = [
        { targets: task.target_interests as string[], userVals: (user.interests as string[]) ?? [] },
        { targets: task.target_platforms as string[], userVals: (user.platforms as string[]) ?? [] },
      ];

      let totalCriteria = 0;
      let matchedCriteria = 0;
      for (const { targets, userVal } of criteria) {
        if (targets?.length > 0) { totalCriteria++; if (userVal && targets.includes(userVal)) matchedCriteria++; }
      }
      for (const { targets, userVals } of arrayMatches) {
        if (targets?.length > 0) { totalCriteria++; if (userVals.some((v: string) => targets.includes(v))) matchedCriteria++; }
      }

      const matchScore = totalCriteria === 0 ? 100 : Math.round((matchedCriteria / totalCriteria) * 100);
      const hidden = totalCriteria > 0 && matchedCriteria === 0;

      return { ...task, matchScore, hidden, lockedByLevel, lockedByType, minLevel };
    });

    const visible = scored
      .filter((t: Record<string, unknown>) => !t.hidden)
      .sort((a: Record<string, unknown>, b: Record<string, unknown>) => {
        // Completed last
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        // Locked last
        const aLocked = (a.lockedByLevel || a.lockedByType) ? 1 : 0;
        const bLocked = (b.lockedByLevel || b.lockedByType) ? 1 : 0;
        if (aLocked !== bLocked) return aLocked - bLocked;
        // Premium first, then participation, then engagement
        const typeOrder: Record<string, number> = { premium: 0, participation: 1, engagement: 2 };
        const aOrder = typeOrder[a.mission_type as string] ?? 2;
        const bOrder = typeOrder[b.mission_type as string] ?? 2;
        if (aOrder !== bOrder) return aOrder - bOrder;
        // Then by match score, then reward
        if ((b.matchScore as number) !== (a.matchScore as number)) return (b.matchScore as number) - (a.matchScore as number);
        return (b.reward as number) - (a.reward as number);
      });

    return NextResponse.json({
      tasks: visible,
      meta: {
        userLevel: userLevelNum,
        levelName: user.level_name ?? "Starter",
        badgeColor: user.badge_color ?? "#888888",
        xp: user.xp ?? 0,
        dailyEarned,
        dailyCap,
        dailyRemaining,
        trustScore: user.trust_score ?? 100,
      },
    });
  } catch (err) {
    console.error("Tasks fetch error:", err);
    return NextResponse.json({ error: "Failed to load tasks" }, { status: 500 });
  }
}
