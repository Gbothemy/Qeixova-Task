import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { ensureUniversalCampaignTables } from "@/lib/universalCampaignEngine";

export async function GET() {
  await ensureUniversalCampaignTables();
  const templates = await sql`
    SELECT template_key, title, mission_category, campaign_goal, default_actions,
      default_platforms, default_reward_qlt, default_contributors, metadata
    FROM campaign_templates
    WHERE is_active = TRUE
    ORDER BY id
  `;

  return NextResponse.json({ templates });
}
