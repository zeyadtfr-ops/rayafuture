"use client";

import { ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NewsItem = {
  category: string;
  title: string;
  excerpt: string;
  date: string;
  days: string;
  gradient: string;
  icon: React.ReactNode;
};

const NEWS: NewsItem[] = [
  {
    category: "اقتصاد وتجارة",
    title: "التحديات الاقتصادية للتصدير والتوسع في الأسواق الجديدة",
    excerpt:
      "يناقش هذا المقال أبرز التحديات التي تواجه المصدرين عند التوسع في الأسواق الجديدة، مع التركيز على العلاقة بين أسعار المنتجات وأجور العمال وأثرها على التنافسية الدولية.",
    date: "أكتوبر ٢٠٢٦",
    days: "مقال حصري",
    gradient: "from-[#0A382F] to-[#115B46]",
    icon: <Spark />,
  },
  {
    category: "إدارة الأعمال",
    title: "مرحلة تحديد الرؤية والهدف: دروس من تجارب عالمية",
    excerpt:
      "يتناول هذا المقال مرحلة تحديد الرؤية والهدف من خلال تجربة جاك ويلش في تشخيص وضعية جنرال إلكتريك وتحديد رؤيته للمستقبل، ودروسها المُستفادة للقادة في المؤسسات الحديثة.",
    date: "أكتوبر ٢٠٢٦",
    days: "مقال حصري",
    gradient: "from-[#115B46] to-[#0A382F]",
    icon: <Quote />,
  },
  {
    category: "حالة دراسية",
    title: "استراتيجية جاك ويلش التغييرية في جنرال إلكتريك",
    excerpt:
      "يستعرض هذا المقال استراتيجية التغيير والتحويل التي اتبعها جاك ويلش خلال رئاسته لشركة جنرال إلكتريك، ودورها في إعادة هيكلة الشركة وتحقيق نمو استثنائي على مدى عقدين.",
    date: "أكتوبر ٢٠٢٦",
    days: "حالة دراسية",
    gradient: "from-[#E69744] to-[#C77B2E]",
    icon: <Users />,
  },
  {
    category: "اعتماد أكاديمي",
    title: "اعتماد المعهد من الهيئة القومية لضمان جودة التعليم",
    excerpt:
      "حصل معهد راية العالي للإدارة والتجارة الخارجية على اعتماد الهيئة القومية لضمان جودة التعليم والاعتماد، تحت إشراف وزارة التعليم العالي والبحث العلمي، بعد استيفاء كافة المعايير الأكاديمية.",
    date: "منذ ٢٠١٨",
    days: "إنجاز مؤسسي",
    gradient: "from-[#115B46] to-[#0A382F]",
    icon: <Trophy />,
  },
];

function Spark() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 2 L13.8 9.5 L21 12 L13.8 14.5 L12 22 L10.2 14.5 L3 12 L10.2 9.5 Z" />
    </svg>
  );
}
function Quote() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M7 7 H4 a1 1 0 0 0 -1 1 v6 a1 1 0 0 0 1 1 h3 a1 1 0 0 0 1 -1 v-3 a3 3 0 0 0 -3 -3 Z M18 7 h-3 a1 1 0 0 0 -1 1 v6 a1 1 0 0 0 1 1 h3 a1 1 0 0 0 1 -1 v-3 a3 3 0 0 0 -3 -3 Z" />
    </svg>
  );
}
function Users() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20 c0-3.3 2.7-6 6-6 s6 2.7 6 6" />
      <circle cx="17" cy="8" r="2.5" />
      <path d="M15 20 c0-2.5 2-4.5 4.5-4.5" />
    </svg>
  );
}
function Trophy() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M6 4 h12 v5 a6 6 0 0 1 -12 0 Z" />
      <path d="M6 5 H4 v2 a3 3 0 0 0 3 3 M18 5 h2 v2 a3 3 0 0 1 -3 3" />
      <path d="M9 19 h6 M12 15 v4" />
    </svg>
  );
}

export default function NewsSection() {
  return (
    <section id="news" className="py-20 bg-[#FBF4ED] relative overflow-hidden">
      {/* Decorative shape */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#E9F2EB] rounded-full -translate-x-1/3 -translate-y-1/3 opacity-50" />

      <div className="container mx-auto px-4 relative">
        {/* Heading */}
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

        {/* News grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {NEWS.map((item, i) => (
            <article
              key={i}
              className="group bg-white rounded-xl overflow-hidden shadow-sm border border-[#D9E2DC] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* Image placeholder with gradient + icon */}
              <div
                className={cn(
                  "relative h-44 bg-gradient-to-bl flex items-center justify-center overflow-hidden",
                  item.gradient
                )}
              >
                {/* Pattern */}
                <svg
                  className="absolute inset-0 w-full h-full opacity-[0.12]"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <defs>
                    <pattern
                      id={`np-${i}`}
                      x="0"
                      y="0"
                      width="40"
                      height="40"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M20 0 L40 20 L20 40 L0 20 Z"
                        fill="none"
                        stroke="#FBF4ED"
                        strokeWidth="0.5"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill={`url(#np-${i})`} />
                </svg>

                {/* Icon */}
                <div className="relative text-white/90 group-hover:scale-110 transition-transform duration-500">
                  {item.icon}
                </div>

                {/* Category badge */}
                <div className="absolute top-3 right-3 bg-white/95 text-[#0A382F] text-[11px] font-bold px-2.5 py-1 rounded-full">
                  {item.category}
                </div>

                {/* Date badge */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white/90 text-[10px] bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
                  <Clock className="h-3 w-3" />
                  {item.days}
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex flex-col flex-1">
                <div className="text-[11px] text-[#E69744] font-bold mb-2">{item.date}</div>
                <h3 className="heading-display text-[#0A382F] text-lg leading-snug mb-2 group-hover:text-[#115B46] transition-colors">
                  {item.title}
                </h3>
                <p className="text-[#5A6B66] text-[13px] leading-relaxed line-clamp-3 mb-4 flex-1">
                  {item.excerpt}
                </p>
                <a
                  href="#"
                  className="inline-flex items-center text-[#0A382F] font-bold text-sm group-hover:text-[#E69744] transition-colors"
                >
                  اقرأ المزيد
                  <ArrowLeft className="h-3.5 w-3.5 mr-1.5 transition-transform group-hover:-translate-x-1" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
