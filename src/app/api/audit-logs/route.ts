/** GET /api/audit-logs — list audit logs (admin only) */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try { await requireAdmin(); } catch (e) { return e as Response; }

  const url = new URL(req.url);
  const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") || 50)));
  const entity = url.searchParams.get("entity");
  const action = url.searchParams.get("action");

  const where: any = {};
  if (entity) where.entity = entity;
  if (action) where.action = action;

  const items = await db.auditLog.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  const total = await db.auditLog.count({ where });

  return NextResponse.json({ items, total });
}
