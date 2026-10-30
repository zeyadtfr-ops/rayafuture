/**
 * GET    /api/articles/[id]   — fetch one article
 * PUT    /api/articles/[id]   — update article (admin only)
 * DELETE /api/articles/[id]   — delete article (admin only)
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminAuthorized, requireAdmin } from "@/lib/auth";

const ALLOWED_STATUSES = new Set([
  "DRAFT",
  "PENDING_REVIEW",
  "APPROVED",
  "REJECTED",
  "PUBLISHED",
]);

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const admin = await isAdminAuthorized();

  const article = await db.article.findUnique({ where: { id } });
  if (!article) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  // Public callers can only view PUBLISHED articles.
  if (!admin && article.status !== "PUBLISHED") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(article);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch (e) {
    return e as Response;
  }

  const { id } = await params;
  const existing = await db.article.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const data: any = {};
  for (const key of [
    "title",
    "excerpt",
    "body",
    "coverImage",
    "category",
    "tags",
    "sourceUrl",
    "sourceId",
    "sourcePlatform",
    "originalText",
  ]) {
    if (key in body) data[key] = body[key];
  }

  // status transition handling
  if (body.status && ALLOWED_STATUSES.has(body.status)) {
    const oldStatus = existing.status;
    data.status = body.status;
    if (body.status === "PUBLISHED" && !existing.publishedAt) {
      data.publishedAt = new Date();
      data.reviewedAt = new Date();
    }
    if (body.status === "APPROVED") {
      data.reviewedAt = new Date();
    }

    // ─── Auto-create notification for student when their article status changes ───
    if (existing.authorId && oldStatus !== body.status) {
      let notifTitle = "";
      let notifMessage = "";
      let notifType = "info";

      if (body.status === "PUBLISHED") {
        notifTitle = "تم نشر مقالك! 🎉";
        notifMessage = `تم نشر مقالك "${existing.title}" في المجلة.`;
        notifType = "article_published";
      } else if (body.status === "REJECTED") {
        notifTitle = "تم رفض مقالك";
        notifMessage = `لم يتم قبول مقالك "${existing.title}" للنشر. يمكنك تعديله وإعادة الإرسال.`;
        notifType = "article_rejected";
      } else if (body.status === "APPROVED") {
        notifTitle = "تم اعتماد مقالك ✅";
        notifMessage = `تم اعتماد مقالك "${existing.title}" وسيتم نشره قريباً.`;
        notifType = "success";
      } else if (body.status === "PENDING_REVIEW") {
        notifTitle = "مقالك قيد المراجعة";
        notifMessage = `تم استلام مقالك "${existing.title}" وهو قيد المراجعة من هيئة التحرير.`;
        notifType = "info";
      }

      if (notifTitle) {
        await db.notification.create({
          data: {
            userId: existing.authorId,
            title: notifTitle,
            message: notifMessage,
            type: notifType,
            link: `/student`,
          },
        });
      }
    }
  }

  if (body.originalPubAt) {
    try {
      data.originalPubAt = new Date(body.originalPubAt);
    } catch {
      /* ignore invalid date */
    }
  }

  const updated = await db.article.update({ where: { id }, data });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch (e) {
    return e as Response;
  }
  const { id } = await params;
  try {
    await db.article.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
