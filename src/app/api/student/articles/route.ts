/**
 * Student articles API
 *
 * GET  /api/student/articles       — view published articles (same as public)
 * POST /api/student/articles       — submit a new article (always DRAFT, needs admin approval)
 *
 * Student auth uses x-student-code + x-student-token headers.
 */

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

async function getStudentUser(req: NextRequest) {
  const studentCode = req.headers.get("x-student-code");
  const token = req.headers.get("x-student-token");
  if (!studentCode || !token) return null;

  const user = await db.user.findUnique({
    where: { studentCode: studentCode.toUpperCase() },
  });
  if (!user || user.role !== "student" || !user.passwordHash) return null;

  const ok = await bcrypt.compare(token, user.passwordHash);
  if (!ok) return null;

  return user;
}

// GET — published articles (students see the same as public + their own submissions)
export async function GET(req: NextRequest) {
  const student = await getStudentUser(req);
  if (!student) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Students see: all PUBLISHED articles + their own submissions (any status)
  const published = await db.article.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: 50,
  });

  // Also get articles submitted by this student (using authorId)
  const mySubmissions = await db.article.findMany({
    where: { authorId: student.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    published,
    mySubmissions,
    student: {
      id: student.id,
      name: student.name,
      studentCode: student.studentCode,
    },
  });
}

// POST — student submits a new article (always DRAFT, needs admin approval)
export async function POST(req: NextRequest) {
  const student = await getStudentUser(req);
  if (!student) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const title = (body.title || "").trim();
  if (title.length < 3) {
    return NextResponse.json(
      { error: "العنوان مطلوب (٣ أحرف على الأقل)" },
      { status: 400 }
    );
  }

  // Generate slug
  const slug =
    title
      .trim()
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) +
    "-" +
    Math.random().toString(36).slice(2, 8);

  const article = await db.article.create({
    data: {
      slug,
      title,
      excerpt: body.excerpt || null,
      body: body.body || null,
      coverImage: body.coverImage || null,
      category: body.category || "مقالات تحريرية",
      tags: body.tags || null,
      status: "DRAFT", // always draft — admin must approve
      sourcePlatform: "student",
      sourceId: `student_${student.id}_${Date.now()}`,
      authorId: student.id,
      originalText: body.body || null,
    },
  });

  return NextResponse.json(
    {
      ok: true,
      article,
      message:
        "تم استلام مقالك. سيتم مراجعته من قبل هيئة التحرير قبل النشر.",
    },
    { status: 201 }
  );
}
