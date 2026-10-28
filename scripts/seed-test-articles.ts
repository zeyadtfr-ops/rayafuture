/**
 * Seed the database with a few clearly-labelled test articles so the
 * editorial workflow can be exercised end-to-end without real Facebook
 * credentials. Run with:
 *
 *   bun run scripts/seed-test-articles.ts
 *
 * Idempotent: re-running will skip records that already exist (matched
 * by sourcePlatform + sourceId).
 */

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const slugify = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) + "-" + Math.random().toString(36).slice(2, 8);

async function main() {
  const tests = [
    {
      title: "[اختبار] مشاركة المعهد في أسبوع الاستدامة بدمياط",
      excerpt:
        "مقال تجريبي لأغراض الاختبار — شارك معهد راية العالي للإدارة والتجارة الخارجية في افتتاح أسبوع الاستدامة بدمياط.",
      body: "هذا مقال تجريبي لأغراض الاختبار فقط.\n\nشارك معهد راية العالي في فعاليات أسبوع الاستدامة بدمياط، ضمن جهوده لتعزيز الوعي البيئي والمسؤولية المجتمعية بين الطلاب.",
      category: "الفعاليات والمؤتمرات",
      coverImage: "/images/gallery-1.jpg",
      sourcePlatform: "test",
      sourceId: "test-001",
      sourceUrl: "https://raya.edu.eg/ar/news#test-001",
      originalPubAt: new Date("2024-10-15"),
      status: "PUBLISHED",
    },
    {
      title: "[اختبار] ملتقى التوظيف الثاني للطلاب والخريجين",
      excerpt:
        "مقال تجريبي لأغراض الاختبار — أعلن المعهد عن انطلاق ملتقى التوظيف الثاني برعاية وحضور رسمي.",
      body: "هذا مقال تجريبي لأغراض الاختبار فقط.\n\nأعلن معهد راية العالي للإدارة والتجارة الخارجية عن انطلاق ملتقى التوظيف الثاني، وذلك برعاية وحضور رسمي، بهدف ربط الطلاب والخريجين بفرص العمل الحقيقية في سوق المصري.",
      category: "فرص تعليمية",
      coverImage: "/images/gallery-2.jpg",
      sourcePlatform: "test",
      sourceId: "test-002",
      sourceUrl: "https://raya.edu.eg/ar/news#test-002",
      originalPubAt: new Date("2024-09-20"),
      status: "PUBLISHED",
    },
    {
      title: "[اختبار] إعلان فتح باب القبول لدفعة ٢٠٢٦-٢٠٢٧",
      excerpt:
        "مقال تجريبي — يعلن المعهد عن استمرار التقديم والقبول للعام الجامعي ٢٠٢٦-٢٠٢٧.",
      body: "هذا مقال تجريبي لأغراض الاختبار فقط.\n\nيعلن معهد راية العالي للإدارة والتجارة الخارجية بدمياط الجديدة عن استمرار التقديم والقبول للعام الجامعي ٢٠٢٦-٢٠٢٧. القبول المباشر مفتوح عبر مكتب التنسيق.",
      category: "إعلانات رسمية",
      coverImage: "/images/news-accreditation.jpg",
      sourcePlatform: "test",
      sourceId: "test-003",
      sourceUrl: "https://raya.edu.eg/ar/news#test-003",
      originalPubAt: new Date("2026-08-01"),
      status: "DRAFT", // demonstrates the editorial workflow — requires approval
    },
  ];

  let created = 0;
  let skipped = 0;

  for (const t of tests) {
    const existing = await db.article.findFirst({
      where: { sourcePlatform: t.sourcePlatform, sourceId: t.sourceId },
    });
    if (existing) {
      skipped++;
      continue;
    }
    const data: any = {
      slug: slugify(t.title),
      title: t.title,
      excerpt: t.excerpt,
      body: t.body,
      coverImage: t.coverImage,
      category: t.category,
      status: t.status,
      sourcePlatform: t.sourcePlatform,
      sourceId: t.sourceId,
      sourceUrl: t.sourceUrl,
      originalText: t.body,
      originalPubAt: t.originalPubAt,
      importedAt: new Date(),
    };
    if (t.status === "PUBLISHED") {
      data.publishedAt = new Date();
    }
    await db.article.create({ data });
    created++;
  }

  console.log(`✓ Seed complete: ${created} created, ${skipped} skipped (already existed)`);
  console.log(`  Test articles are clearly labelled "[اختبار]" in their titles.`);
  console.log(`  Two are PUBLISHED (visible on the public site), one is DRAFT (needs approval).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
