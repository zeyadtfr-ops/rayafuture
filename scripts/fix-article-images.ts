// Update each article's coverImage to a topic-appropriate photo.
// Maps article titles → appropriate image files now available in /public/images.
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

// Map: title (substring) → image path
const IMAGE_MAP: { match: string; image: string }[] = [
  { match: "العام الدراسي الجديد", image: "/images/news-school-start.jpg" },
  { match: "حوار مع الطالب المتميز", image: "/images/news-student-interview.jpg" },
  { match: "إنجازات طلاب", image: "/images/news-achievements.jpg" },
  { match: "ورشة عمل", image: "/images/news-workshop.jpg" },
  { match: "أهمية القراءة", image: "/images/news-reading.jpg" },
  { match: "تشجير المدرسة", image: "/images/news-tree-planting.jpg" },
  { match: "تذاكر بفعالية", image: "/images/news-study.jpg" },
  { match: "كرة القدم", image: "/images/news-football.jpg" },
  { match: "النشاط الثقافي", image: "/images/news-cultural.jpg" },
  { match: "الكيك بوكس", image: "/images/news-kickboxing.jpg" },
  { match: "الفنون التشكيلية", image: "/images/news-art.jpg" },
  { match: "معرض العلوم", image: "/images/news-science-fair.jpg" },
  { match: "أمسية شعرية", image: "/images/news-poetry.jpg" },
  { match: "دورة تدريبية في البرمجة", image: "/images/news-programming.jpg" },
  { match: "مسابقة القصة القصيرة", image: "/images/news-writing.jpg" },
  { match: "التطوع المجتمعي", image: "/images/news-environment.jpg" },
  { match: "نادي البيئة", image: "/images/news-environment.jpg" },
  { match: "نادي العلوم", image: "/images/news-science-fair.jpg" },
  { match: "أسبوع الاستدامة", image: "/images/news-environment.jpg" },
  { match: "ملتقى التوظيف", image: "/images/news-workshop.jpg" },
  { match: "فتح باب القبول", image: "/images/news-school-start.jpg" },
];

const all = await db.article.findMany();
let updated = 0;

for (const a of all) {
  const mapping = IMAGE_MAP.find((m) => a.title.includes(m.match));
  if (mapping && a.coverImage !== mapping.image) {
    await db.article.update({
      where: { id: a.id },
      data: { coverImage: mapping.image },
    });
    console.log(`  ✓ ${a.title.slice(0, 50)} → ${mapping.image}`);
    updated++;
  }
}

console.log(`\n✓ Done: ${updated} articles updated with topic-appropriate images.`);

const final = await db.article.findMany({
  select: { title: true, coverImage: true, status: true },
  orderBy: { publishedAt: "desc" },
});
console.log("\nFinal state:");
console.table(final.slice(0, 25));

await db.$disconnect();
