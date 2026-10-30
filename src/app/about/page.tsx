"use client";

import {
  Target,
  Eye,
  Award,
  Users,
  BookOpen,
  Building2,
  Phone,
  Mail,
  MapPin,
  Globe,
  Facebook,
  Clock,
  CheckCircle2,
  GraduationCap,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-paper">
      {/* ════════════ HERO ════════════ */}
      <section className="bg-forest text-paper relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <defs>
            <pattern id="about-pat" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M40 0 L80 40 L40 80 L0 40 Z" fill="none" stroke="#C9A04A" strokeWidth="0.6" />
              <circle cx="40" cy="40" r="14" fill="none" stroke="#F6F2E9" strokeWidth="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#about-pat)" />
        </svg>
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-brand-green/40 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-gold/15 blur-3xl" />

        <div className="container mx-auto px-4 relative z-10 py-16 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-xs text-gold tracking-[0.3em] uppercase mb-4 font-bold">
              About the Institute
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-5">
              عن معهد راية العالي
            </h1>
            <p className="text-lg sm:text-xl text-paper/80 mb-8 leading-relaxed max-w-2xl">
              صرح تعليمي تحت إشراف وزارة التعليم العالي والبحث العلمي، تأسس بالقرار
              الوزاري رقم ٤١٥١ لسنة ٢٠١٨، ويمنح درجة البكالوريوس في التجارة المعادلة
              لدرجات الجامعات المصرية.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#vision" className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 text-paper/80 hover:text-gold hover:border-gold/30 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                <Eye className="h-4 w-4" /> الرؤية والرسالة
              </a>
              <a href="#departments" className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 text-paper/80 hover:text-gold hover:border-gold/30 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                <BookOpen className="h-4 w-4" /> الأقسام الأكاديمية
              </a>
              <a href="#contact-info" className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 text-paper/80 hover:text-gold hover:border-gold/30 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                <Phone className="h-4 w-4" /> معلومات التواصل
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 z-10">
          <svg viewBox="0 0 1440 60" className="w-full h-[40px]" preserveAspectRatio="none" aria-hidden>
            <path d="M0 40 C 240 10 480 10 720 30 C 960 50 1200 50 1440 20 L 1440 60 L 0 60 Z" fill="var(--color-paper)" />
          </svg>
        </div>
      </section>

      {/* ════════════ INSTITUTE OVERVIEW ════════════ */}
      <section className="bg-paper py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs text-gold tracking-[0.2em] uppercase mb-3 font-bold">
                Institute Overview
              </p>
              <h2 className="text-3xl font-bold text-forest mb-6 leading-snug">
                نظرة عامة على المعهد
              </h2>
              <div className="space-y-4 text-[#5A6B66] leading-relaxed">
                <p>
                  معهد راية العالي للإدارة والتجارة الخارجية بدمياط الجديدة هو صرح
                  تعليمي تحت إشراف وزارة التعليم العالي والبحث العلمي. أُنشأ بالقرار
                  الوزاري رقم ٤١٥١ لسنة ٢٠١٨، ويقبل طلابه عن طريق مكتب تنسيق القبول
                  بالجامعات والمعاهد.
                </p>
                <p>
                  يمنح المعهد درجة البكالوريوس في التجارة، وهي معادلة للدرجات التي
                  تمنحها الجامعات المصرية، بعد أربعة مستويات دراسية. المعهد معتمد من
                  الهيئة القومية لضمان جودة التعليم والاعتماد.
                </p>
                <p>
                  يسعى المعهد إلى إعداد كوادر بشرية متميزة في مجالات الإدارة
                  والتجارة الخارجية والمحاسبة ونظم المعلومات، قادرة على المنافسة في
                  سوق العمل المحلي والإقليمي.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gold/10 rounded-2xl blur-2xl" />
              <div className="relative rounded-xl overflow-hidden shadow-2xl border border-border-warm">
                <img
                  src="/images/hero-campus.jpg"
                  alt="معهد راية العالي"
                  className="w-full h-80 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ VISION & MISSION ════════════ */}
      <section id="vision" className="bg-paper-warm py-16 border-y border-border-warm">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Vision */}
            <div className="bg-white rounded-xl p-8 border border-border-warm shadow-sm">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-forest/10 mb-5">
                <Eye className="h-7 w-7 text-forest" />
              </div>
              <h3 className="text-2xl font-bold text-forest mb-3">الرؤية</h3>
              <p className="text-[#5A6B66] leading-relaxed">
                أن يكون معهد راية العالي للإدارة والتجارة الخارجية مؤسسة تعليمية
                رائدة في إعداد الكوادر المتخصصة في مجالات الإدارة والتجارة الخارجية
                والمحاسبة ونظم المعلومات، معتمدين على أحدث المناهج العلمية والتقنيات
                الحديثة، ومساهمين في خدمة المجتمع وتنمية الاقتصاد المصري.
              </p>
            </div>

            {/* Mission */}
            <div className="bg-white rounded-xl p-8 border border-border-warm shadow-sm">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-gold/15 mb-5">
                <Target className="h-7 w-7 text-gold" />
              </div>
              <h3 className="text-2xl font-bold text-forest mb-3">الرسالة</h3>
              <p className="text-[#5A6B66] leading-relaxed">
                تقديم تعليم عالي الجودة في تخصصات الإدارة والتجارة الخارجية
                والمحاسبة ونظم معلومات الأعمال، مع تنمية المهارات الشخصية والمهنية
                للطلاب، وتشجيع البحث العلمي والابتكار، وتوثيق الروابط مع المجتمع
                المحلي والدولي من خلال شراكات أكاديمية ومهنية فعّالة.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ ACADEMIC DEPARTMENTS ════════════ */}
      <section id="departments" className="bg-paper py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <p className="text-xs text-gold tracking-[0.2em] uppercase mb-3 font-bold">
              Academic Departments
            </p>
            <h2 className="text-3xl font-bold text-forest mb-4">الأقسام الأكاديمية</h2>
            <p className="text-[#5A6B66] leading-relaxed">
              يضم المعهد خمسة أقسام علمية تغطي مجالات الإدارة والتجارة والمحاسبة
              ونظم المعلومات والعلوم الأساسية.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "إدارة الأعمال", icon: Building2, desc: "إدارة المنظمات والمشروعات وريادة الأعمال" },
              { name: "نظم المعلومات والحاسب الآلي", icon: BookOpen, desc: "تكنولوجيا المعلومات ونظم إدارة الأعمال" },
              { name: "المحاسبة والمراجعة", icon: Award, desc: "المحاسبة المالية والمراجعة والمعايير الدولية" },
              { name: "الاقتصاد والمالية العامة", icon: Target, desc: "التحليل الاقتصادي والسياسات المالية" },
              { name: "العلوم الأساسية", icon: GraduationCap, desc: "العلوم المساعدة للتخصصات الإدارية والتجارية" },
              { name: "اقتصاديات التجارة الخارجية", icon: Globe, desc: "التجارة الدولية والعلاقات الاقتصادية" },
            ].map((dept, i) => (
              <div
                key={i}
                className="group bg-white rounded-xl p-6 border border-border-warm hover:shadow-lg hover:border-gold/40 transition-all"
              >
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-forest/5 group-hover:bg-gold/10 transition-colors mb-4">
                  <dept.icon className="h-6 w-6 text-forest group-hover:text-gold transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-forest mb-2">{dept.name}</h3>
                <p className="text-sm text-[#5A6B66] leading-relaxed">{dept.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ BACHELOR PROGRAMS ════════════ */}
      <section className="bg-brand-green text-paper py-16 relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <defs>
            <pattern id="prog-pat" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="30" fill="none" stroke="#C9A04A" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#prog-pat)" />
        </svg>

        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <p className="text-xs text-gold tracking-[0.2em] uppercase mb-3 font-bold">
              Bachelor Programs
            </p>
            <h2 className="text-3xl font-bold mb-4">برامج البكالوريوس</h2>
            <p className="text-paper/70 leading-relaxed">
              ثلاث برامج بكالوريوس معتمدة من وزارة التعليم العالي، كل برنامج ١٣٢
              ساعة معتمدة على ٤ مستويات دراسية.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { code: "ACC", name: "بكالوريوس المحاسبة والمراجعة", desc: "إعداد خريجين متخصصين في المحاسبة المالية والمراجعة وأخلاقيات المهنة" },
              { code: "FT", name: "بكالوريوس اقتصاديات التجارة الخارجية", desc: "إعداد الطالب للعمل في مجالات التجارة الخارجية والعلاقات الاقتصادية الدولية" },
              { code: "BIS", name: "بكالوريوس نظم معلومات الأعمال", desc: "دمج مقررات الإدارة وتكنولوجيا المعلومات لحل المشكلات الإدارية" },
            ].map((prog) => (
              <div
                key={prog.code}
                className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="text-4xl font-bold text-gold/40 mb-3">{prog.code}</div>
                <h3 className="text-lg font-bold mb-3 leading-snug">{prog.name}</h3>
                <p className="text-sm text-paper/70 leading-relaxed mb-4">{prog.desc}</p>
                <div className="flex items-center gap-2 text-xs text-gold">
                  <CheckCircle2 className="h-4 w-4" />
                  ١٣٢ ساعة معتمدة
                </div>
                <div className="flex items-center gap-2 text-xs text-paper/60 mt-1">
                  <Clock className="h-4 w-4" />
                  ٤ مستويات دراسية
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ ACCREDITATION ════════════ */}
      <section className="bg-paper py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gold/10 mb-5">
              <Award className="h-8 w-8 text-gold" />
            </div>
            <h2 className="text-3xl font-bold text-forest mb-4">الاعتماد الأكاديمي</h2>
            <p className="text-[#5A6B66] leading-relaxed mb-8">
              معهد راية العالي للإدارة والتجارة الخارجية معتمد من الهيئة القومية
              لضمان جودة التعليم والاعتماد، تحت إشراف وزارة التعليم العالي والبحث
              العلمي. تأسس بالقرار الوزاري رقم ٤١٥١ لسنة ٢٠١٨.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white rounded-lg px-5 py-3 border border-border-warm flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="text-sm font-bold text-forest">اعتماد الهيئة القومية لضمان الجودة</span>
              </div>
              <div className="bg-white rounded-lg px-5 py-3 border border-border-warm flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="text-sm font-bold text-forest">إشراف وزارة التعليم العالي</span>
              </div>
              <div className="bg-white rounded-lg px-5 py-3 border border-border-warm flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="text-sm font-bold text-forest">القرار الوزاري ٤١٥١ لسنة ٢٠١٨</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ CONTACT INFO ════════════ */}
      <section id="contact-info" className="bg-forest text-paper py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs text-gold tracking-[0.2em] uppercase mb-3 font-bold">
              Contact Information
            </p>
            <h2 className="text-3xl font-bold mb-4">معلومات التواصل</h2>
            <p className="text-paper/70">تواصل معنا عبر القنوات الرسمية المعتمدة</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gold/10 mb-4">
                <MapPin className="h-6 w-6 text-gold" />
              </div>
              <h3 className="font-bold mb-2">العنوان</h3>
              <p className="text-sm text-paper/70 leading-relaxed">
                دمياط الجديدة، الحي الثاني،<br />أمام نادي المستقبل
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gold/10 mb-4">
                <Phone className="h-6 w-6 text-gold" />
              </div>
              <h3 className="font-bold mb-2">الهاتف</h3>
              <p className="text-sm text-paper/70 leading-relaxed" dir="ltr">
                01030830822
              </p>
              <p className="text-xs text-paper/50 mt-1">واتساب: 01030830811</p>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gold/10 mb-4">
                <Mail className="h-6 w-6 text-gold" />
              </div>
              <h3 className="font-bold mb-2">البريد الإلكتروني</h3>
              <a href="mailto:rayaedu2@gmail.com" className="text-sm text-gold hover:underline" dir="ltr">
                rayaedu2@gmail.com
              </a>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gold/10 mb-4">
                <Globe className="h-6 w-6 text-gold" />
              </div>
              <h3 className="font-bold mb-2">الموقع الرسمي</h3>
              <a href="https://raya.edu.eg" target="_blank" rel="noopener noreferrer" className="text-sm text-gold hover:underline" dir="ltr">
                raya.edu.eg
              </a>
              <a href="https://www.facebook.com/share/1Duv3juc3d/" target="_blank" rel="noopener noreferrer" className="text-xs text-paper/50 hover:text-gold mt-1 block">
                <Facebook className="h-3 w-3 inline ml-1" />
                صفحة الفيسبوك
              </a>
            </div>
          </div>

          <div className="text-center mt-10">
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-gold hover:bg-[#A07B2E] text-white font-bold px-6 py-3 rounded-md transition-colors"
            >
              <Mail className="h-5 w-5" />
              أرسل لنا رسالة
            </a>
          </div>
        </div>
      </section>

      {/* ════════════ FOOTER ════════════ */}
      <footer className="bg-forest text-paper py-6 border-t border-white/5">
        <div className="container mx-auto px-4 text-center text-xs text-paper/55">
          © راية المستقبل — معهد راية العالي للإدارة والتجارة الخارجية. جميع الحقوق محفوظة.
        </div>
      </footer>
    </div>
  );
}
