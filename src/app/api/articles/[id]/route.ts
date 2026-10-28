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
    data.status = body.status;
    if (body.status === "PUBLISHED" && !existing.publishedAt) {
      data.publishedAt = new Date();
      data.reviewedAt = new Date();
    }
    if (body.status === "APPROVED") {
      data.reviewedAt = new Date();
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
