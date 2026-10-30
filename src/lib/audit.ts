/**
 * Audit logging helper.
 * Call logAction() after any administrative operation to record it.
 */
import { db } from "@/lib/db";
import { headers } from "next/headers";
import type { SessionUser } from "@/lib/auth";

export async function logAction(params: {
  action: string;
  entity: string;
  entityId?: string;
  actorId?: string;
  actorName?: string;
  details?: string;
}) {
  try {
    await db.auditLog.create({
      data: {
        action: params.action,
        entity: params.entity,
        entityId: params.entityId || null,
        actorId: params.actorId || null,
        actorName: params.actorName || "master",
        details: params.details || null,
      },
    });
  } catch (e) {
    // Audit logging should never break the main operation
    console.error("Audit log failed:", e);
  }
}

/**
 * Resolves actor info from the current session for audit logging.
 */
export async function getActorInfo(session: any): Promise<{ id?: string; name: string }> {
  if (session?.kind === "member" && session.user) {
    return { id: session.id, name: session.name || session.email };
  }
  return { name: "master" };
}
