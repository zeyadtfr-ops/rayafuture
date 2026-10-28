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
            من حياة المعهد
            <span className="w-8 h-0.5 bg-[#E69744]" />
          </div>
          <h2 className="heading-display text-white text-4xl md:text-5xl mb-4">
            إنجازات.. ومبادرات.. ومسيرة أكاديمية
          </h2>
          <p className="text-white/70 text-base leading-relaxed">
            مساحة موثَّقة لتكريم الطلاب المتميزين، ومتابعة أنشطة اتحاد الطلاب، ومراجعة
            أهم المحطات في التقويم الأكاديمي للمعهد.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Student Achievements */}
          <article className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
            {/* Top visual */}
            <div className="relative h-44 bg-gradient-to-bl from-[#E69744] to-[#C77B2E] overflow-hidden">
              <svg
                className="absolute inset-0 w-full h-full opacity-[0.15]"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <defs>
                  <pattern
                    id="ach-pat"
                    x="0"
                    y="0"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <path d="M20 0 L40 20 L20 40 L0 20 Z" fill="none" stroke="#FBF4ED" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#ach-pat)" />
              </svg>
              <div className="relative h-full flex flex-col items-center justify-center text-white">
                <Award className="h-12 w-12 mb-2" />
                <div className="heading-display text-3xl">+٣٠</div>
                <div className="text-[11px] text-white/80">طالباً مكرَّماً هذا العام</div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="heading-display text-white text-2xl mb-3 flex items-center gap-2">
                إنجازات الطلاب
              </h3>
              <p className="text-white/70 text-sm leading-relaxed mb-4">
                تكريمات، مشاركات بحثية، جوائز، ومشروعات طلابية متميزة. نرصد هنا مسيرة
                الطلاب الذين رفعوا اسم المعهد في محافل علمية وثقافية ورياضية متعددة.
              </p>
              <ul className="space-y-2 mb-5">
                {[
                  "المركز الأول في مسابقة الابتكار التقني",
                  "مشاركة بحثية في مؤتمر نظم المعلومات",
                  "تكريم الطلاب الأوائل على الدفعات",
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
                عرض كل الإنجازات
                <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
              </a>
            </div>
          </article>

          {/* Card 2: Student Union */}
          <article className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
            <div className="relative h-44 bg-gradient-to-bl from-[#115B46] to-[#0A382F] overflow-hidden">
              <svg
                className="absolute inset-0 w-full h-full opacity-[0.15]"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <defs>
                  <pattern
                    id="union-pat"
                    x="0"
                    y="0"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="20" cy="20" r="8" fill="none" stroke="#FBF4ED" strokeWidth="0.5" />
                    <circle cx="20" cy="20" r="14" fill="none" stroke="#FBF4ED" strokeWidth="0.3" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#union-pat)" />
              </svg>
              <div className="relative h-full flex flex-col items-center justify-center text-white">
                <Users2 className="h-12 w-12 mb-2" />
                <div className="heading-display text-3xl">٧ أسر</div>
                <div className="text-[11px] text-white/80">ولجنة نشاط طلابي</div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="heading-display text-white text-2xl mb-3">اتحاد الطلاب</h3>
              <p className="text-white/70 text-sm leading-relaxed mb-4">
                الأسر والأنشطة والمبادرات والتطوع والرحلات. مساحة لحياة الطلاب خارج
                قاعات الدراسة، حيث تتشكَّل الذاكرة الجماعية للمعهد عاماً بعد عام.
              </p>
              <ul className="space-y-2 mb-5">
                {[
                  "أسر علمية وثقافية وفنية متخصصة",
                  "مبادرات تطوعية ومشاركة مجتمعية",
                  "تنظيم الفعاليات والمؤتمرات الطلابية",
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
                تعرَّف على الأسر
                <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
              </a>
            </div>
          </article>

          {/* Card 3: Academic Calendar */}
          <article className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
            <div className="relative h-44 bg-gradient-to-bl from-[#FBF4ED] to-[#E9F2EB] overflow-hidden">
              <svg
                className="absolute inset-0 w-full h-full opacity-[0.15]"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <defs>
                  <pattern
                    id="cal-pat"
                    x="0"
                    y="0"
                    width="30"
                    height="30"
                    patternUnits="userSpaceOnUse"
                  >
                    <path d="M0 15 L30 15 M15 0 L15 30" stroke="#0A382F" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#cal-pat)" />
              </svg>
              <div className="relative h-full flex flex-col items-center justify-center text-[#0A382F]">
                <CalendarDays className="h-12 w-12 mb-2" />
                <div className="heading-display text-3xl">٢٠٢٦/٢٠٢٧</div>
                <div className="text-[11px] text-[#0A382F]/70">العام الأكاديمي الحالي</div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="heading-display text-white text-2xl mb-3">التقويم الأكاديمي</h3>
              <p className="text-white/70 text-sm leading-relaxed mb-4">
                أهم المحطات الأكاديمية للعام الدراسي: بداية الفصول، الامتحانات،
                الإجازات، ومواعيد التسجيل. خط زمني منظم يربط الطالب بمسيرته الدراسية.
              </p>
              <ul className="space-y-2 mb-5">
                {[
                  { d: "١٥ نوفمبر", t: "بداية التسجيل للفصل الثاني" },
                  { d: "٢٥ ديسمبر", t: "بداية امتحانات نهاية الفصل" },
                  { d: "١٠ يناير", t: "إعلان نتائج الفصل الأول" },
                ].map((ev, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between gap-2 text-white/80 text-[13px] border-b border-white/10 pb-1.5"
                  >
                    <span>{ev.t}</span>
                    <span className="text-[#E69744] font-bold text-[11px] whitespace-nowrap">
                      {ev.d}
                    </span>
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className="inline-flex items-center text-[#E69744] font-bold text-sm hover:text-white transition-colors"
              >
                التقويم الكامل
                <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
