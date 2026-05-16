import { NextRequest, NextResponse } from "next/server";
import { getBusinessSession } from "@/lib/businessAuth";
import { sql } from "@/lib/db";
import { QLT_PROGRESS_REWARDS } from "@/lib/missionEngine";
import { ensureBusinessWalletTables } from "@/lib/businessWallet";

export async function GET() {
  const session = await getBusinessSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tasks = await sql`
    SELECT
      t.*,
      t.task_status AS status,
      COUNT(c.id)::int AS total_completions,
      COUNT(CASE WHEN c.status = 'pending'  THEN 1 END)::int AS pending_completions,
      COUNT(CASE WHEN c.status = 'approved' THEN 1 END)::int AS approved_completions,
      COUNT(CASE WHEN c.status = 'rejected' THEN 1 END)::int AS rejected_completions
    FROM tasks t
    LEFT JOIN completions c ON c.task_id = t.id
    WHERE t.business_id = ${session.businessId}
      AND COALESCE(t.task_status, '') <> 'deleted'
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
    mission_type, verification_type, difficulty, min_level,
    target_professions, target_interests, target_platforms,
    target_age_ranges, target_genders, target_states,
  } = await req.json();

  const rewardAmount = Number(reward);
  if (!title?.trim() || !category || !Number.isFinite(rewardAmount) || rewardAmount <= 0) {
    return NextResponse.json({ error: "Title, category and a valid reward are required" }, { status: 400 });
  }

  const targetCount = Math.max(0, Number(target_completion_count) || 0);
  const explicitBudget = Math.max(0, Number(total_budget) || 0);
  const resolvedBudget = explicitBudget > 0 ? explicitBudget : targetCount > 0 ? rewardAmount * targetCount : 0;
  if (resolvedBudget <= 0) {
    return NextResponse.json({ error: "Campaign budget is required before launch" }, { status: 400 });
  }

  await ensureBusinessWalletTables();
  const businessRows = await sql`SELECT balance FROM businesses WHERE id = ${session.businessId}`;
  const balance = Number(businessRows[0]?.balance ?? 0);
  if (balance < resolvedBudget) {
    return NextResponse.json({
      error: `Insufficient business balance. Fund at least ${(resolvedBudget - balance).toLocaleString()} more QLT before launching this campaign.`,
      requiredBalance: resolvedBudget,
      currentBalance: balance,
    }, { status: 402 });
  }

  const screenshotLimit = Math.max(1, Math.min(5, Number(max_screenshots) || 1));
  const cleanSteps = Array.isArray(steps)
    ? steps.filter((step) => typeof step === "string" && step.trim()).map((step) => step.trim())
    : [];

  const resolvedMissionType: string = mission_type || (() => {
    if (["Social Media"].includes(category)) return "engagement";
    if (["Survey", "AI Testing"].includes(category)) return "participation";
    return "premium";
  })();

  const resolvedXpReward = QLT_PROGRESS_REWARDS[resolvedMissionType] ?? 0;
  const resolvedVerification = verification_type || proof_type || "screenshot";
  const resolvedDifficulty = difficulty || (resolvedMissionType === "premium" ? "hard" : resolvedMissionType === "participation" ? "medium" : "easy");
  const resolvedMinLevel = min_level || (resolvedMissionType === "premium" ? 2 : 1);

  const result = await sql`
    INSERT INTO tasks (
      title, category, reward, duration, icon, color,
      instructions, steps, proof_type, proof_label, max_screenshots,
      task_link, total_budget, target_completion_count,
      mission_type, xp_reward, verification_type, difficulty, min_level,
      target_professions, target_interests, target_platforms,
      target_age_ranges, target_genders, target_states,
      business_id, is_active, task_status
    ) VALUES (
      ${title.trim()}, ${category}, ${rewardAmount},
      ${duration || "5 min"}, ${"📋"}, ${"#111111"},
      ${instructions || ""}, ${cleanSteps}, ${proof_type || "screenshot"},
      ${proof_label || "Upload screenshot as proof"},
      ${screenshotLimit}, ${task_link || ""},
      ${resolvedBudget}, ${targetCount},
      ${resolvedMissionType}, ${resolvedXpReward}, ${resolvedVerification},
      ${resolvedDifficulty}, ${resolvedMinLevel},
      ${target_professions || []}, ${target_interests || []}, ${target_platforms || []},
      ${target_age_ranges || []}, ${target_genders || []}, ${target_states || []},
      ${session.businessId}, false, 'pending_review'
    )
    RETURNING id
  `;

  await sql`UPDATE businesses SET balance = balance - ${resolvedBudget} WHERE id = ${session.businessId}`;
  await sql`
    INSERT INTO business_transactions (business_id, type, amount, label, status, provider, reference, metadata)
    VALUES (
      ${session.businessId}, 'debit', ${resolvedBudget}, ${"Campaign budget reserved: " + title.trim()},
      'completed', 'campaign_budget', ${"QXC-" + result[0].id},
      ${JSON.stringify({ taskId: result[0].id, reward: rewardAmount, targetCount })}
    )
  `;

  return NextResponse.json({ ok: true, taskId: result[0].id, missionType: resolvedMissionType });
}
