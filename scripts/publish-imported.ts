// Publish all DRAFT articles so they appear on the public homepage.
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

const drafts = await db.article.findMany({
  where: { status: "DRAFT", sourcePlatform: "external_magazine" },
  select: { id: true, title: true },
});
console.log(`Found ${drafts.length} draft articles from external_magazine to publish.`);

for (const a of drafts) {
  await db.article.update({
    where: { id: a.id },
    data: {
      status: "PUBLISHED",
      publishedAt: new Date(),
      reviewedAt: new Date(),
    },
  });
  console.log(`  ✓ Published: ${a.title}`);
}

const all = await db.article.groupBy({ by: ["status"], _count: true });
console.log("\nFinal DB state:");
console.table(all);

await db.$disconnect();
