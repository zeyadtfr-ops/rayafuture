/**
 * POST /api/articles/import  — bulk import articles from a JSON payload.
 * Admin only. Supports the shape produced by Facebook data exports or
 * by manual editorial preparation:
 *
 * Body: { articles: Array<{ title, body, excerpt?, coverImage?, category?,
 *                           sourcePlatform?, sourceId?, sourceUrl?,
 *                           originalText?, originalPubAt? }> }
 *
 * Behavior:
 *   - Idempotent: an article with the same (sourcePlatform, sourceId) is
 *     not re-created.
 *   - All imported articles default to status DRAFT so an editor must
 *     explicitly approve + publish before they appear on the site.
 *   - Returns counts: created, skipped (duplicate), failed, errors[].
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

function slugifyArabic(input: string): string {
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
  for (let i = 0; i < 5; i++) {
    const existing = await db.article.findUnique({ where: { slug } });
    if (!existing) return slug;
    slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
  }
  return slug;
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch (e) {
    return e as Response;
  }

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const articles = Array.isArray(payload)
    ? payload
    : Array.isArray(payload.articles)
    ? payload.articles
    : null;

  if (!articles) {
    return NextResponse.json(
      { error: "Body must be an array or { articles: [...] }" },
      { status: 400 }
    );
  }

  let created = 0;
  let skipped = 0;
  let failed = 0;
  const errors: { index: number; message: string }[] = [];

  for (let i = 0; i < articles.length; i++) {
    const item = articles[i];
    try {
      if (!item.title || typeof item.title !== "string" || item.title.trim().length < 3) {
        throw new Error("title is required (min 3 chars)");
      }

      // Idempotent check: skip if (sourcePlatform, sourceId) already exists.
      if (item.sourcePlatform && item.sourceId) {
        const dup = await db.article.findFirst({
          where: {
            sourcePlatform: item.sourcePlatform,
            sourceId: item.sourceId,
          },
        });
        if (dup) {
          skipped++;
          continue;
        }
      }

      const slug = await uniqueSlug(item.title);
      const data: any = {
        slug,
        title: item.title.trim(),
        excerpt: item.excerpt || null,
        body: item.body || item.originalText || null,
        coverImage: item.coverImage || null,
        category: item.category || "أخبار المؤسسة",
        tags: item.tags || null,
        status: "DRAFT", // always start as draft — editor must approve
        sourcePlatform: item.sourcePlatform || "import",
        sourceId: item.sourceId || null,
        sourceUrl: item.sourceUrl || null,
        originalText: item.originalText || null,
        importedAt: new Date(),
      };
      if (item.originalPubAt) {
        try {
          data.originalPubAt = new Date(item.originalPubAt);
        } catch {
          /* ignore */
        }
      }

      await db.article.create({ data });
      created++;
    } catch (e: any) {
      failed++;
      errors.push({ index: i, message: e?.message || "Unknown error" });
    }
  }

  return NextResponse.json({
    created,
    skipped,
    failed,
    errors,
    total: articles.length,
  });
}
