// Seed default categories + tags
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

const CATEGORIES = [
  { name: "أخبار", description: "آخر الأخبار الطلابية والمدرسية", color: "#C9A04A", sortOrder: 1 },
  { name: "أنشطة طلابية", description: "متابعة لأنشطة الطلاب والأندية", color: "#0B5A45", sortOrder: 2 },
  { name: "تربية وتعليم", description: "قضايا التعليم والممارسات التربوية", color: "#063D30", sortOrder: 3 },
  { name: "حوار", description: "لقاءات مع شخصيات طلابية ومدرسية", color: "#E5CB8B", sortOrder: 4 },
  { name: "رأي", description: "مقالات رأي الطالب", color: "#A07B2E", sortOrder: 5 },
  { name: "فرص تعليمية", description: "منح ودورات تدريبية وفرص للطلاب", color: "#C9A04A", sortOrder: 6 },
  { name: "الفعاليات والمؤتمرات", description: "تغطية الفعاليات والمناسبات", color: "#0B5A45", sortOrder: 7 },
  { name: "إنجازات الطلاب", description: "تكريمات ومشروعات وطلاب متميزون", color: "#C9A04A", sortOrder: 8 },
  { name: "المسابقات والجوائز", description: "مسابقات وجوائز للطلاب", color: "#E5CB8B", sortOrder: 9 },
  { name: "مبادرات طلابية", description: "مبادرات وأندية طلابية", color: "#0B5A45", sortOrder: 10 },
  { name: "إعلانات رسمية", description: "إعلانات رسمية من إدارة المعهد", color: "#B91C1C", sortOrder: 11 },
  { name: "مقالات تحريرية", description: "مقالات تحريرية متنوعة", color: "#063D30", sortOrder: 12 },
];

async function main() {
  let created = 0, skipped = 0;
  for (const c of CATEGORIES) {
    const slug = c.name.replace(/\s+/g, "-").toLowerCase();
    const existing = await db.category.findUnique({ where: { slug } });
    if (existing) { skipped++; continue; }
    await db.category.create({ data: { ...c, slug } });
    created++;
  }
  console.log(`✓ Categories: ${created} created, ${skipped} skipped`);
  await db.$disconnect();
}
main().catch(console.error);
