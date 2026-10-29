/**
 * POST /api/articles/bulk  — bulk operations on multiple articles at once.
 * Admin only.
 *
 * Body: {
 *   ids: string[],
 *   action: "publish" | "unpublish" | "delete" | "approve" | "reject" | "send_to_review"
 * }
 *
 * Returns: { ok, action, affected, requested, errors[] }
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

const ACTIONS = new Set([
  "publish",
  "unpublish",
  "delete",
  "approve",
  "reject",
  "send_to_review",
]);

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch (e) {
    return e as Response;
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const ids: string[] = Array.isArray(body?.ids) ? body.ids : [];
  const action: string = body?.action;

  if (ids.length === 0) {
    return NextResponse.json({ error: "ids array is required" }, { status: 400 });
  }
  if (!ACTIONS.has(action)) {
    return NextResponse.json(
      { error: `action must be one of: ${Array.from(ACTIONS).join(", ")}` },
      { status: 400 }
    );
  }

  let affected = 0;
  const errors: { id: string; message: string }[] = [];

  const buildUpdate = (a: string): any => {
    const now = new Date();
    switch (a) {
      case "publish":
        return { status: "PUBLISHED", publishedAt: now, reviewedAt: now };
      case "unpublish":
        return { status: "DRAFT", publishedAt: null };
      case "approve":
        return { status: "APPROVED", reviewedAt: now };
      case "reject":
        return { status: "REJECTED", reviewedAt: now };
      case "send_to_review":
        return { status: "PENDING_REVIEW" };
      default:
        return {};
    }
  };

  if (action === "delete") {
    for (const id of ids) {
      try {
        await db.article.delete({ where: { id } });
        affected++;
      } catch (e: any) {
        if (e?.code !== "P2025") {
          errors.push({ id, message: e?.message || "Unknown error" });
        }
      }
    }
  } else {
    const update = buildUpdate(action);
    for (const id of ids) {
      try {
        await db.article.update({ where: { id }, data: update });
        affected++;
      } catch (e: any) {
        if (e?.code === "P2025") continue;
        errors.push({ id, message: e?.message || "Unknown error" });
      }
    }
  }

  return NextResponse.json({
    ok: true,
    action,
    affected,
    requested: ids.length,
    errors,
  });
}
