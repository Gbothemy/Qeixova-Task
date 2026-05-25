import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/adminAuth";
import { sql } from "@/lib/db";
import { refundUnusedCampaignBudget, transitionCampaignStatus } from "@/lib/universalCampaignEngine";

export async function GET(req: NextRequest) {
  if (!await checkAdminAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "";
  const campaigns = await sql`
    SELECT c.*, b.name AS business_name, b.email AS business_email,
      COUNT(cs.id)::int AS submissions_count,
      COUNT(CASE WHEN cs.status = 'under_review' THEN 1 END)::int AS pending_review_count,
      COUNT(CASE WHEN cs.status = 'disputed' THEN 1 END)::int AS disputed_count
    FROM campaigns c
    LEFT JOIN businesses b ON b.id = c.business_id
    LEFT JOIN campaign_submissions cs ON cs.campaign_id = c.id
    WHERE (${status} = '' OR c.status = ${status})
    GROUP BY c.id, b.id
    ORDER BY c.created_at DESC
    LIMIT 100
  `;

  return NextResponse.json({ campaigns });
}

export async function PATCH(req: NextRequest) {
  if (!await checkAdminAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const campaignId = Number(body.campaignId);
  const action = String(body.action || "");
  if (!Number.isFinite(campaignId) || campaignId <= 0) {
    return NextResponse.json({ error: "campaignId required" }, { status: 400 });
  }

  if (action === "approve" || action === "launch") {
    const result = await transitionCampaignStatus({ campaignId, nextStatus: "live", reason: body.reason });
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: Number(result.status) });
    return NextResponse.json(result);
  }
  if (action === "pause") {
    const result = await transitionCampaignStatus({ campaignId, nextStatus: "paused", reason: body.reason });
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: Number(result.status) });
    return NextResponse.json(result);
  }
  if (action === "resume") {
    const result = await transitionCampaignStatus({ campaignId, nextStatus: "live", reason: body.reason });
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: Number(result.status) });
    return NextResponse.json(result);
  }
  if (action === "reject") {
    await sql`
      UPDATE campaigns
      SET status = 'rejected',
          metadata = jsonb_set(metadata, '{rejectionReason}', to_jsonb(${String(body.reason || "Campaign needs edits")}::text), true),
          updated_at = NOW()
      WHERE id = ${campaignId}
    `;
    await sql`
      UPDATE tasks
      SET is_active = FALSE, task_status = 'rejected', campaign_status = 'rejected'
      WHERE id = (SELECT task_id FROM campaigns WHERE id = ${campaignId})
    `;
    return NextResponse.json({ ok: true, status: "rejected" });
  }
  if (action === "close") {
    await refundUnusedCampaignBudget({ campaignId, reason: "admin_close_campaign" });
    await sql`UPDATE campaigns SET status = 'closed', updated_at = NOW() WHERE id = ${campaignId}`;
    await sql`
      UPDATE tasks
      SET is_active = FALSE, task_status = 'closed', campaign_status = 'closed'
      WHERE id = (SELECT task_id FROM campaigns WHERE id = ${campaignId})
    `;
    return NextResponse.json({ ok: true, status: "closed" });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
