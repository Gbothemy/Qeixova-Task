import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { claimCampaignSlot } from "@/lib/universalCampaignEngine";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const campaignId = Number(body.campaignId);
  if (!Number.isFinite(campaignId) || campaignId <= 0) {
    return NextResponse.json({ error: "campaignId required" }, { status: 400 });
  }

  const result = await claimCampaignSlot({ campaignId, contributorId: session.userId });
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });

  return NextResponse.json(result);
}
