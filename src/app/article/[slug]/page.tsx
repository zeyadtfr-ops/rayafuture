import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Calendar, ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";

const AR_DATE = new Intl.DateTimeFormat("ar-EG", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const article = await db.article.findUnique({
    where: { slug },
  });

  if (!article || article.status !== "PUBLISHED") {
    notFound();
  }

  // Get related articles (same category, exclude current)
  const related = await db.article.findMany({
    where: {
      category: article.category,
      status: "PUBLISHED",
      id: { not: article.id },
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
  });

  const coverImage = article.coverImage || "/images/news-economics.jpg";
  const pubDate = article.publishedAt || article.originalPubAt || article.createdAt;

  // JSON-LD structured data for the article
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt || "",
    image: coverImage,
    datePublished: pubDate.toISOString(),
    author: {
      "@type": "Organization",
      name: "راية المستقبل",
    },
    publisher: {
      "@type": "EducationalOrganization",
      name: "معهد راية العالي للإدارة والتجارة الخارجية",
    },
  };

  return (
    <div className="min-h-screen bg-paper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Back link */}
      <div className="bg-paper-warm border-b border-border-warm">
        <div className="container mx-auto px-4 py-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-[#5A6B66] hover:text-gold transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
            العودة للرئيسية
          </Link>
        </div>
      </div>

      {/* Article header */}
      <article className="bg-paper">
        {/* Cover image */}
        <div className="relative h-64 md:h-96 overflow-hidden bg-forest">
          <img
            src={coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest/60 to-transparent" />
        </div>

        <div className="container mx-auto px-4 max-w-3xl">
          {/* Meta */}
          <div className="-mt-12 relative z-10 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-gold text-white text-xs font-bold px-3 py-1 rounded-md">
                {article.category}
              </span>
              <span className="text-xs text-white bg-forest/80 backdrop-blur-sm px-3 py-1 rounded-md flex items-center gap-1.5">
                <Calendar className="h-3 w-3" />
                {AR_DATE.format(new Date(pubDate))}
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-forest leading-snug mb-6">
            {article.title}
          </h1>

          {/* Excerpt */}
          {article.excerpt && (
            <p className="text-lg text-[#5A6B66] leading-relaxed mb-8 border-r-4 border-gold pr-4">
              {article.excerpt}
            </p>
          )}

          {/* Body */}
          {article.body && (
            <div className="prose prose-lg max-w-none">
              {article.body.split("\n").map((para, i) => (
                <p key={i} className="text-[#202820] leading-loose mb-4 text-base">
                  {para}
                </p>
              ))}
            </div>
          )}

          {/* Tags */}
          {article.tags && (
            <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-border-warm">
              {article.tags.split(",").map((tag, i) => (
                <span
                  key={i}
                  className="text-xs bg-paper-warm text-[#5A6B66] px-3 py-1 rounded-full"
                >
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}

          {/* Source link */}
          {article.sourceUrl && (
            <div className="mt-6">
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-gold hover:underline"
              >
                المصدر الأصلي
                <ArrowLeft className="h-3.5 w-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <section className="bg-paper-warm py-12 mt-12 border-t border-border-warm">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-2xl font-bold text-forest mb-6">مقالات ذات صلة</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/article/${r.slug}`}
                    className="group bg-white rounded-md overflow-hidden border border-border-warm hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-32 overflow-hidden bg-forest">
                      <img
                        src={r.coverImage || "/images/news-economics.jpg"}
                        alt={r.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-bold text-forest line-clamp-2 group-hover:text-gold transition-colors">
                        {r.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>

      {/* Footer */}
      <footer className="bg-forest text-paper py-6">
        <div className="container mx-auto px-4 text-center text-xs text-paper/55">
          © راية المستقبل — جميع الحقوق محفوظة.
        </div>
      </footer>
    </div>
  );
}
