/**
 * GET  /api/articles         — list articles (public: only PUBLISHED; admin: all)
 * POST /api/articles         — create a new article (admin only)
 *
 * Query params for GET:
 *   ?status=PUBLISHED         filter by status (admin only — public always PUBLISHED)
 *   ?category=...             filter by category
 *   ?q=...                    free-text search on title + excerpt + body
 *   ?limit=20                 page size (max 100)
 *   ?offset=0                 pagination offset
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

function slugifyArabic(input: string): string {
  // Generate a URL-safe slug. For Arabic, we fall back to a short id suffix
  // when the title contains no Latin chars, to keep URLs readable.
  const base = input
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  const suffix = Math.random().toString(36).slice(2, 8);
  return base ? `${base}-${suffix}` : `article-${suffix}`;
}

async function uniqueSlug(title: string): Promise<string> {
  let slug = slugifyArabic(title);
  // ensure uniqueness against existing records
  for (let i = 0; i < 5; i++) {
    const existing = await db.article.findUnique({ where: { slug } });
    if (!existing) return slug;
    slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
  }
  return slug;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const statusParam = url.searchParams.get("status");
  const category = url.searchParams.get("category");
  const q = url.searchParams.get("q")?.trim() || "";
  const limit = Math.min(
    100,
    Math.max(1, Number(url.searchParams.get("limit") || 20))
  );
  const offset = Math.max(0, Number(url.searchParams.get("offset") || 0));

  const admin = await isAdminAuthorized();

  // Public callers can ONLY see published articles.
  // Admins without an explicit status filter see ALL statuses.
  let status: string | undefined;
  if (admin) {
    status = statusParam && ALLOWED_STATUSES.has(statusParam) ? statusParam : undefined;
  } else {
    status = "PUBLISHED";
  }

  const where: any = {};
  if (status) where.status = status;
  if (category) where.category = category;
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { excerpt: { contains: q } },
      { body: { contains: q } },
    ];
  }

  const [items, total] = await Promise.all([
    db.article.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      take: limit,
      skip: offset,
    }),
    db.article.count({ where }),
  ]);

  return NextResponse.json({ items, total, limit, offset });
}

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
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  if (!body.title || typeof body.title !== "string" || body.title.trim().length < 3) {
    return NextResponse.json(
      { error: "title is required (min 3 chars)" },
      { status: 400 }
    );
  }

  const slug = await uniqueSlug(body.title);
  const data: any = {
    slug,
    title: body.title.trim(),
    excerpt: body.excerpt || null,
    body: body.body || null,
    coverImage: body.coverImage || null,
    category: body.category || "أخبار المؤسسة",
    tags: body.tags || null,
    status: ALLOWED_STATUSES.has(body.status) ? body.status : "DRAFT",
    sourcePlatform: body.sourcePlatform || "manual",
    sourceId: body.sourceId || null,
    sourceUrl: body.sourceUrl || null,
    originalText: body.originalText || null,
  };

  if (data.status === "PUBLISHED") {
    data.publishedAt = new Date();
  }
  if (body.originalPubAt) {
    data.originalPubAt = new Date(body.originalPubAt);
  }

  const article = await db.article.create({ data });
  return NextResponse.json(article, { status: 201 });
}
