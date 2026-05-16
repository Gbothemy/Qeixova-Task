import { sql } from "@/lib/db";

export type AuditEvent =
  | "mission_submitted"
  | "mission_approved"
  | "mission_rejected"
  | "qlt_progress_awarded"
  | "level_up"
  | "wallet_credited"
  | "wallet_debited"
  | "referral_bonus"
  | "milestone_awarded"
  | "trust_score_updated"
  | "rate_limit_hit"
  | "fraud_flagged";

export async function log(
  userId: number,
  event: AuditEvent,
  data: Record<string, unknown> = {},
  entityType?: string,
  entityId?: number,
) {
  try {
    await sql`
      INSERT INTO audit_logs (user_id, event_type, entity_type, entity_id, data)
      VALUES (${userId}, ${event}, ${entityType ?? null}, ${entityId ?? null}, ${JSON.stringify(data)})
    `;
  } catch {
    // Never let logging break the main flow
  }
}
