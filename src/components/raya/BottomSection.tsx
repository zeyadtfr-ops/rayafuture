"use client";

import { ArrowLeft, Star, Images, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BottomSection() {
  return (
    <section className="py-20 bg-[#FBF4ED] relative overflow-hidden">
      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Success Stories — wide card */}
          <article className="lg:col-span-2 bg-white rounded-2xl overflow-hidden shadow-sm border border-[#D9E2DC] flex flex-col md:flex-row">
            {/* Visual */}
            <div className="relative md:w-2/5 min-h-[240px] bg-gradient-to-bl from-[#0A382F] to-[#115B46] overflow-hidden">
              <svg
                className="absolute inset-0 w-full h-full opacity-[0.1]"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <defs>
                  <pattern
                    id="story-pat"
                    x="0"
                    y="0"
                    width="60"
                    height="60"
                    patternUnits="userSpaceOnUse"
                  >
                    <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke="#FBF4ED" strokeWidth="0.5" />
                    <circle cx="30" cy="30" r="6" fill="#E69744" opacity="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#story-pat)" />
              </svg>
              <div className="relative h-full flex flex-col items-center justify-center p-8 text-center text-white">
                <Quote className="h-10 w-10 text-[#E69744] mb-4" />
                <p className="heading-display text-2xl leading-relaxed mb-4">
                  «من قاعة الدراسة إلى سوق العمل.. صرح تعليمي معتمد يُعِدّ قادة المستقبل»
                </p>
                <div className="text-[12px] text-white/70">معهد راية العالي للإدارة والتجارة الخارجية</div>
              </div>
            </div>

            {/* Content */}
            <div className="md:w-3/5 p-7">
              <div className="inline-flex items-center gap-2 text-[#E69744] text-xs font-bold tracking-wider mb-3">
                <Star className="h-4 w-4" />
                اعتماد وتميز
              </div>
              <h3 className="heading-display text-[#0A382F] text-2xl mb-3 leading-snug">
                اعتماد أكاديمي ومسيرة متميزة
              </h3>
              <p className="text-[#5A6B66] text-sm leading-relaxed mb-5">
                معهد راية العالي معتمد من الهيئة القومية لضمان جودة التعليم والاعتماد،
                تحت إشراف وزارة التعليم العالي والبحث العلمي. تأسس بالقرار الوزاري رقم ٤١٥١ لسنة ٢٠١٨،
                ويمنح درجة البكالوريوس في التجارة المعادلة لدرجات الجامعات المصرية.
              </p>
              <div className="space-y-2 mb-5">
                {[
                  "اعتماد الهيئة القومية لضمان جودة التعليم",
                  "إشراف وزارة التعليم العالي والبحث العلمي",
                  "القرار الوزاري رقم ٤١٥١ لسنة ٢٠١٨",
                ].map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-[13px] text-[#0A382F]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E69744]" />
                    {s}
                  </div>
                ))}
              </div>
              <Button
                asChild
                variant="outline"
                className="border-[#0A382F] text-[#0A382F] hover:bg-[#0A382F] hover:text-[#FBF4ED] rounded-md h-10 px-4 font-bold text-sm"
              >
                <a href="#">
                  المزيد عن المعهد
                  <ArrowLeft className="h-4 w-4 mr-1" />
                </a>
              </Button>
            </div>
          </article>

          {/* Events Gallery */}
          <article className="bg-gradient-to-bl from-[#E69744] to-[#C77B2E] rounded-2xl overflow-hidden shadow-md text-white p-7 flex flex-col">
            <div className="inline-flex items-center gap-2 text-white/90 text-xs font-bold tracking-wider mb-3">
              <Images className="h-4 w-4" />
              معرض الوسائط
            </div>
            <h3 className="heading-display text-2xl mb-3 leading-snug">
              ألبوم فعاليات المعهد
            </h3>
            <p className="text-white/90 text-sm leading-relaxed mb-5">
              تغطيات بالصور ومقاطع الفيديو لفعاليات المعهد، مؤتمراته، وورشه،
              وأنشطته الطلابية على مدار العام.
            </p>

            {/* Mini gallery grid */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              {[
                "/images/gallery-1.jpg",
                "/images/gallery-2.jpg",
                "/images/gallery-3.jpg",
                "/images/gallery-4.jpg",
                "/images/gallery-5.jpg",
                "/images/gallery-6.jpg",
              ].map((src, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg overflow-hidden border border-white/20 group/gal"
                >
                  <img
                    src={src}
                    alt={`فعالية ${i + 1}`}
                    className="w-full h-full object-cover group-hover/gal:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>

            <div className="mt-auto">
              <a
                href="#gallery"
                className="inline-flex items-center bg-white/15 hover:bg-white text-white hover:text-[#0A382F] font-bold text-sm rounded-md px-4 py-2 transition-colors"
              >
                تصفَّح المعرض
                <ArrowLeft className="h-4 w-4 mr-1" />
              </a>
            </div>
          </article>

        </div>
      </div>
    </section>
  );
}
