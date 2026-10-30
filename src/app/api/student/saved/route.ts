/**
 * GET    /api/student/saved       — list student's saved articles
 * POST   /api/student/saved       — save an article (body: { articleId })
 * DELETE /api/student/saved       — unsave an article (body: { articleId })
 *
 * Student auth via x-student-code + x-student-token headers.
 */

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

async function getStudent(req: NextRequest) {
  const code = req.headers.get("x-student-code");
  const token = req.headers.get("x-student-token");
  if (!code || !token) return null;

  const user = await db.user.findUnique({
    where: { studentCode: code.toUpperCase() },
  });
  if (!user || user.role !== "student" || !user.passwordHash) return null;
  const ok = await bcrypt.compare(token, user.passwordHash);
  return ok ? user : null;
}

export async function GET(req: NextRequest) {
  const student = await getStudent(req);
  if (!student) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const saved = await db.savedArticle.findMany({
    where: { userId: student.id },
    orderBy: { createdAt: "desc" },
  });

  // Fetch full article details
  const articleIds = saved.map((s) => s.articleId);
  const articles = await db.article.findMany({
    where: { id: { in: articleIds } },
  });

  // Merge saved metadata with article data
  const items = saved
    .map((s) => {
      const article = articles.find((a) => a.id === s.articleId);
      if (!article) return null;
      return {
        ...article,
        savedAt: s.createdAt,
      };
    })
    .filter(Boolean);

  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const student = await getStudent(req);
  if (!student) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: any;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const articleId = body.articleId;
  if (!articleId) return NextResponse.json({ error: "articleId is required" }, { status: 400 });

  // Check article exists
  const article = await db.article.findUnique({ where: { id: articleId } });
  if (!article) return NextResponse.json({ error: "المقال غير موجود" }, { status: 404 });

  // Upsert (ignore if already saved)
  try {
    await db.savedArticle.create({ data: { userId: student.id, articleId } });
  } catch (e: any) {
    if (e?.code === "P2002") {
      // Already saved — that's fine
      return NextResponse.json({ ok: true, message: "محفوظ بالفعل" });
    }
    throw e;
  }

  return NextResponse.json({ ok: true, message: "تم حفظ المقال" }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const student = await getStudent(req);
  if (!student) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: any;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const articleId = body.articleId;
  if (!articleId) return NextResponse.json({ error: "articleId is required" }, { status: 400 });

  await db.savedArticle.deleteMany({
    where: { userId: student.id, articleId },
  });

  return NextResponse.json({ ok: true, message: "تم إزالة المقال من المحفوظات" });
}
