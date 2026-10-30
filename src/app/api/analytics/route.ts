/** GET /api/analytics — dashboard analytics (admin only) */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(_req: NextRequest) {
  try { await requireAdmin(); } catch (e) { return e as Response; }

  // ── Content stats ──
  const totalArticles = await db.article.count();
  const published = await db.article.count({ where: { status: "PUBLISHED" } });
  const drafts = await db.article.count({ where: { status: "DRAFT" } });
  const pending = await db.article.count({ where: { status: "PENDING_REVIEW" } });
  const approved = await db.article.count({ where: { status: "APPROVED" } });
  const rejected = await db.article.count({ where: { status: "REJECTED" } });

  // ── User stats ──
  const totalUsers = await db.user.count();
  const students = await db.user.count({ where: { role: "student" } });
  const editors = await db.user.count({ where: { role: "editor" } });
  const admins = await db.user.count({ where: { role: "admin" } });

  // ── Other stats ──
  const totalCategories = await db.category.count();
  const totalTags = await db.tag.count();
  const totalSubscribers = await db.newsletter.count({ where: { status: "active" } });
  const totalContactMsgs = await db.contactMessage.count();
  const unreadMsgs = await db.contactMessage.count({ where: { status: "new" } });
  const totalAuditLogs = await db.auditLog.count();

  // ── Category distribution ──
  const allArticles = await db.article.findMany({
    select: { category: true, status: true, createdAt: true, publishedAt: true },
  });

  const categoryDist: Record<string, number> = {};
  allArticles.forEach((a) => {
    categoryDist[a.category] = (categoryDist[a.category] || 0) + 1;
  });

  // ── Publishing activity (last 7 days) ──
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentArticles = allArticles.filter(
    (a) => new Date(a.createdAt) >= sevenDaysAgo
  );

  const dailyActivity: { date: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);

    const count = allArticles.filter((a) => {
      const ac = new Date(a.createdAt);
      return ac >= d && ac < next;
    }).length;

    dailyActivity.push({
      date: new Intl.DateTimeFormat("ar-EG", { weekday: "short", day: "numeric" }).format(d),
      count,
    });
  }

  // ── Source distribution ──
  const sourceDist: Record<string, number> = {};
  const sources = await db.article.findMany({
    select: { sourcePlatform: true },
  });
  sources.forEach((s) => {
    const key = s.sourcePlatform || "manual";
    sourceDist[key] = (sourceDist[key] || 0) + 1;
  });

  // ── Recent audit logs ──
  const recentLogs = await db.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return NextResponse.json({
    content: {
      totalArticles,
      published,
      drafts,
      pending,
      approved,
      rejected,
    },
    users: {
      total: totalUsers,
      students,
      editors,
      admins,
    },
    misc: {
      totalCategories,
      totalTags,
      totalSubscribers,
      totalContactMsgs,
      unreadMsgs,
      totalAuditLogs,
    },
    charts: {
      categoryDist: Object.entries(categoryDist)
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => ({ name, count })),
      dailyActivity,
      sourceDist: Object.entries(sourceDist).map(([name, count]) => ({ name, count })),
    },
    recentLogs,
  });
}
