"use client";

import { ArrowLeft, Award, Users2, CalendarDays, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThreeColumnSection() {
  return (
    <section
      id="student-life"
      className="py-20 bg-gradient-to-b from-[#0A382F] to-[#06241D] relative overflow-hidden"
    >
      {/* Decorative pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.04]"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <pattern
            id="three-pat"
            x="0"
            y="0"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="50" cy="50" r="30" fill="none" stroke="#E69744" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="15" fill="none" stroke="#FBF4ED" strokeWidth="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#three-pat)" />
      </svg>

      <div className="container mx-auto px-4 relative">
        {/* Heading */}
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-[#E69744] text-sm font-bold tracking-wider mb-3 justify-center">
            <span className="w-8 h-0.5 bg-[#E69744]" />
            البرامج الأكاديمية
            <span className="w-8 h-0.5 bg-[#E69744]" />
          </div>
          <h2 className="heading-display text-white text-4xl md:text-5xl mb-4">
            برامج بكالوريوس معتمدة في التجارة وإدارة الأعمال
          </h2>
          <p className="text-white/70 text-base leading-relaxed">
            يقدم معهد راية العالي للإدارة والتجارة الخارجية ثلاث برامج بكالوريوس معتمدة
            من وزارة التعليم العالي، تمنح درجة معادلة لدرجات الجامعات المصرية بعد أربعة مستويات دراسية.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: ACC Program */}
          <article className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
            {/* Top image */}
            <div className="relative h-44 overflow-hidden">
              <img
                src="/images/program-acc.jpg"
                alt="بكالوريوس المحاسبة والمراجعة"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A382F]/95 via-[#0A382F]/40 to-transparent" />
              <div className="relative h-full flex flex-col items-center justify-center text-white">
                <Award className="h-12 w-12 mb-2 drop-shadow-lg" />
                <div className="heading-display text-3xl drop-shadow-lg">ACC</div>
                <div className="text-[11px] text-white/95 drop-shadow-lg font-bold">١٣٢ ساعة معتمدة</div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="heading-display text-white text-2xl mb-3 flex items-center gap-2">
                بكالوريوس المحاسبة والمراجعة
              </h3>
              <p className="text-white/70 text-sm leading-relaxed mb-4">
                برنامج متخصص يركز على إعداد خريجين متميزين في المحاسبة المالية والمراجعة
                وأخلاقيات المهنة، مع التركيز على المعايير المحاسبية الدولية والممارسات الحديثة.
              </p>
              <ul className="space-y-2 mb-5">
                {[
                  "١٣٢ ساعة معتمدة على ٤ مستويات دراسية",
                  "محاسبة مالية ومراجعة ومعايير دولية",
                  "فرص عمل في مكاتب المحاسبة والشركات",
                ].map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-white/80 text-[13px]">
                    <CheckCircle2 className="h-4 w-4 text-[#E69744] mt-0.5 flex-shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className="inline-flex items-center text-[#E69744] font-bold text-sm hover:text-white transition-colors"
              >
                تفاصيل البرنامج
                <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
              </a>
            </div>
          </article>

          {/* Card 2: FT Program */}
          <article className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
            <div className="relative h-44 overflow-hidden">
              <img
                src="/images/program-ft.jpg"
                alt="بكالوريوس اقتصاديات التجارة الخارجية"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A382F]/95 via-[#0A382F]/40 to-transparent" />
              <div className="relative h-full flex flex-col items-center justify-center text-white">
                <Users2 className="h-12 w-12 mb-2 drop-shadow-lg" />
                <div className="heading-display text-3xl drop-shadow-lg">FT</div>
                <div className="text-[11px] text-white/95 drop-shadow-lg font-bold">١٣٢ ساعة معتمدة</div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="heading-display text-white text-2xl mb-3">بكالوريوس اقتصاديات التجارة الخارجية</h3>
              <p className="text-white/70 text-sm leading-relaxed mb-4">
                برنامج يُعِدّ الطالب للعمل في مجالات التجارة الخارجية والعلاقات الاقتصادية
                الدولية، مع التركيز على التصدير والاستيراد والأسواق العالمية واتفاقيات التجارة الحرة.
              </p>
              <ul className="space-y-2 mb-5">
                {[
                  "١٣٢ ساعة معتمدة على ٤ مستويات دراسية",
                  "تجارة دولية وعلاقات اقتصادية",
                  "فرص في شركات التصدير والغرف التجارية",
                ].map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-white/80 text-[13px]">
                    <CheckCircle2 className="h-4 w-4 text-[#E69744] mt-0.5 flex-shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className="inline-flex items-center text-[#E69744] font-bold text-sm hover:text-white transition-colors"
              >
                تفاصيل البرنامج
                <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
              </a>
            </div>
          </article>

          {/* Card 3: BIS Program */}
          <article className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
            <div className="relative h-44 overflow-hidden">
              <img
                src="/images/program-bis.jpg"
                alt="بكالوريوس نظم معلومات الأعمال"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A382F]/95 via-[#0A382F]/40 to-transparent" />
              <div className="relative h-full flex flex-col items-center justify-center text-white">
                <CalendarDays className="h-12 w-12 mb-2 drop-shadow-lg" />
                <div className="heading-display text-3xl drop-shadow-lg">BIS</div>
                <div className="text-[11px] text-white/95 drop-shadow-lg font-bold">١٣٢ ساعة معتمدة</div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="heading-display text-white text-2xl mb-3">بكالوريوس نظم معلومات الأعمال</h3>
              <p className="text-white/70 text-sm leading-relaxed mb-4">
                برنامج يجمع بين مقررات الإدارة وتكنولوجيا المعلومات، يُعِدّ خريجين قادرين
                على توظيف نظم المعلومات في حل المشكلات الإدارية وتطوير الأعمال والتحول الرقمي.
              </p>
              <ul className="space-y-2 mb-5">
                {[
                  "١٣٢ ساعة معتمدة على ٤ مستويات دراسية",
                  "دمج بين الإدارة وتكنولوجيا المعلومات",
                  "فرص في شركات التحول الرقمي والبيانات",
                ].map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-white/80 text-[13px]">
                    <CheckCircle2 className="h-4 w-4 text-[#E69744] mt-0.5 flex-shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className="inline-flex items-center text-[#E69744] font-bold text-sm hover:text-white transition-colors"
              >
                تفاصيل البرنامج
                <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
