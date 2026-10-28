"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

type NewsItem = {
  id?: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  days: string;
  image: string;
  sourceUrl?: string | null;
};

// Fallback content shown when DB is empty (preserves the previous design).
const FALLBACK_NEWS: NewsItem[] = [
  {
    category: "اقتصاد وتجارة",
    title: "التحديات الاقتصادية للتصدير والتوسع في الأسواق الجديدة",
    excerpt:
      "يناقش هذا المقال أبرز التحديات التي تواجه المصدرين عند التوسع في الأسواق الجديدة، مع التركيز على العلاقة بين أسعار المنتجات وأجور العمال وأثرها على التنافسية الدولية.",
    date: "أكتوبر ٢٠٢٦",
    days: "مقال حصري",
    image: "/images/news-economics.jpg",
  },
  {
    category: "إدارة الأعمال",
    title: "مرحلة تحديد الرؤية والهدف: دروس من تجارب عالمية",
    excerpt:
      "يتناول هذا المقال مرحلة تحديد الرؤية والهدف من خلال تجربة جاك ويلش في تشخيص وضعية جنرال إلكتريك وتحديد رؤيته للمستقبل، ودروسها المُستفادة للقادة في المؤسسات الحديثة.",
    date: "أكتوبر ٢٠٢٦",
    days: "مقال حصري",
    image: "/images/news-management.jpg",
  },
  {
    category: "حالة دراسية",
    title: "استراتيجية جاك ويلش التغييرية في جنرال إلكتريك",
    excerpt:
      "يستعرض هذا المقال استراتيجية التغيير والتحويل التي اتبعها جاك ويلش خلال رئاسته لشركة جنرال إلكتريك، ودورها في إعادة هيكلة الشركة وتحقيق نمو استثنائي على مدى عقدين.",
    date: "أكتوبر ٢٠٢٦",
    days: "حالة دراسية",
    image: "/images/news-strategy.jpg",
  },
  {
    category: "اعتماد أكاديمي",
    title: "اعتماد المعهد من الهيئة القومية لضمان جودة التعليم",
    excerpt:
      "حصل معهد راية العالي للإدارة والتجارة الخارجية على اعتماد الهيئة القومية لضمان جودة التعليم والاعتماد، تحت إشراف وزارة التعليم العالي والبحث العلمي، بعد استيفاء كافة المعايير الأكاديمية.",
    date: "منذ ٢٠١٨",
    days: "إنجاز مؤسسي",
    image: "/images/news-accreditation.jpg",
  },
];

const AR_DATE = new Intl.DateTimeFormat("ar-EG", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

function Spark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2 L13.8 9.5 L21 12 L13.8 14.5 L12 22 L10.2 14.5 L3 12 L10.2 9.5 Z" />
    </svg>
  );
}

export default function NewsSection() {
  const [items, setItems] = useState<NewsItem[]>(FALLBACK_NEWS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/articles?limit=8");
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        const mapped: NewsItem[] = (data.items || []).map((a: any) => ({
          id: a.id,
          category: a.category || "أخبار",
          title: a.title,
          excerpt: a.excerpt || "",
          date: a.publishedAt
            ? AR_DATE.format(new Date(a.publishedAt))
            : a.originalPubAt
            ? AR_DATE.format(new Date(a.originalPubAt))
            : AR_DATE.format(new Date(a.createdAt)),
          days: a.sourcePlatform === "facebook" ? "من فيسبوك" : "مقال",
          image: a.coverImage || "/images/news-economics.jpg",
          sourceUrl: a.sourceUrl,
        }));
        if (mapped.length > 0) {
          // If fewer than 4 published articles exist, pad with fallback
          // so the grid always looks complete (matches the original design).
          if (mapped.length < 4) {
            const needed = 4 - mapped.length;
            const pad = FALLBACK_NEWS.slice(0, needed).map((f, i) => ({
              ...f,
              id: `fallback-${i}`,
            }));
            setItems([...mapped, ...pad]);
          } else {
            setItems(mapped);
          }
        }
      } catch {
        /* keep fallback */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="news" className="py-20 bg-[#FBF4ED] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#E9F2EB] rounded-full -translate-x-1/3 -translate-y-1/3 opacity-50" />

      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-[#E69744] text-sm font-bold tracking-wider mb-3">
              <span className="w-8 h-0.5 bg-[#E69744]" />
              آخر التحديثات
            </div>
            <h2 className="heading-display text-[#0A382F] text-4xl md:text-5xl mb-3">
              أحدث المقالات والمواد الأكاديمية
            </h2>
            <p className="text-[#5A6B66] text-base max-w-2xl leading-relaxed">
              مقالات وحالات دراسية مختارة تخدم طلاب معهد راية العالي للإدارة والتجارة الخارجية،
              تغطي أحدث موضوعات الاقتصاد وإدارة الأعمال والتجارة الدولية.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="border-[#0A382F] text-[#0A382F] hover:bg-[#0A382F] hover:text-[#FBF4ED] rounded-md h-11 px-5 font-bold self-start md:self-end"
          >
            <a href="#sections">
              كل الأخبار
              <ArrowLeft className="h-4 w-4 mr-1" />
            </a>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <article
              key={item.id || i}
              className="group bg-white rounded-xl overflow-hidden shadow-sm border border-[#D9E2DC] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className="relative h-44 overflow-hidden bg-[#0A382F]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A382F]/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 h-10 w-10 rounded-full bg-[#E69744] flex items-center justify-center text-white shadow-lg">
                  <Spark />
                </div>
                <div className="absolute top-3 right-3 bg-white/95 text-[#0A382F] text-[11px] font-bold px-2.5 py-1 rounded-full">
                  {item.category}
                </div>
                <div className="absolute top-3 left-3 flex items-center gap-1 text-white/90 text-[10px] bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
                  <Clock className="h-3 w-3" />
                  {item.days}
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <div className="text-[11px] text-[#E69744] font-bold mb-2">
                  {item.date}
                </div>
                <h3 className="heading-display text-[#0A382F] text-lg leading-snug mb-2 group-hover:text-[#115B46] transition-colors">
                  {item.title}
                </h3>
                <p className="text-[#5A6B66] text-[13px] leading-relaxed line-clamp-3 mb-4 flex-1">
                  {item.excerpt}
                </p>
                <a
                  href={item.sourceUrl || "#"}
                  target={item.sourceUrl ? "_blank" : undefined}
                  rel={item.sourceUrl ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center text-[#0A382F] font-bold text-sm group-hover:text-[#E69744] transition-colors"
                >
                  اقرأ المزيد
                  <ArrowLeft className="h-3.5 w-3.5 mr-1.5 transition-transform group-hover:-translate-x-1" />
                </a>
              </div>
            </article>
          ))}
        </div>

        {loading && (
          <div className="text-center text-xs text-[#5A6B66]/60 mt-6 flex items-center justify-center gap-2">
            <FileText className="h-3 w-3" />
            جارٍ تحميل المقالات من قاعدة البيانات...
          </div>
        )}
      </div>
    </section>
  );
}
