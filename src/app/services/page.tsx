"use client";

import {
  GraduationCap,
  BookOpen,
  HelpCircle,
  Phone,
  FileText,
  Users,
  Briefcase,
  Heart,
  ArrowLeft,
} from "lucide-react";

const SERVICES = [
  {
    icon: GraduationCap,
    title: "الإرشاد الأكاديمي",
    desc: "نظام إرشاد أكاديمي لمساعدة الطلاب في اختيار المسار الدراسي المناسب ومتابعة تقدمهم الأكاديمي.",
    contact: "شؤون الطلاب",
  },
  {
    icon: FileText,
    title: "شؤون الطلاب",
    desc: "خدمات التسجيل، القبول، الإفادات، وكل ما يخص الأوراق الرسمية للطلاب.",
    contact: "01030830822",
  },
  {
    icon: BookOpen,
    title: "المكتبة والمراجع",
    desc: "مكتبة تضم المراجع والكتب الدراسية في تخصصات الإدارة والتجارة والمحاسبة ونظم المعلومات.",
    contact: "المكتبة",
  },
  {
    icon: Users,
    title: "اتحاد الطلاب",
    desc: "ممثلي الطلاب لرعاية المصالح الطلابية وتنظيم الأنشطة الثقافية والرياضية والفنية.",
    contact: "مكتب اتحاد الطلاب",
  },
  {
    icon: Briefcase,
    title: "التدريب والتوظيف",
    desc: "ملتقى التوظيف السنوي + فرص تدريبية في الشركات والمؤسسات لطلاب وخريجي المعهد.",
    contact: "وحدة التدريب",
  },
  {
    icon: Heart,
    title: "الخدمات الصحية والاجتماعية",
    desc: "رعاية صحية واجتماعية للطلاب، ومتابعة الحالات التي تحتاج دعم خاص.",
    contact: "الخدمات الاجتماعية",
  },
];

const FAQS = [
  {
    q: "كيف أسجل في المعهد؟",
    a: "يتم القبول عن طريق مكتب تنسيق القبول بالجامعات والمعاهد. يقبل المعهد الحاصلين على الثانوية العامة والفنية والأزهرية والشهادات المعادلة.",
  },
  {
    q: "ما هي البرامج المتاحة؟",
    a: "ثلاث برامج: بكالوريوس المحاسبة والمراجعة (ACC)، بكالوريوس اقتصاديات التجارة الخارجية (FT)، وبكالوريوس نظم معلومات الأعمال (BIS).",
  },
  {
    q: "هل الشهادة معتمدة؟",
    a: "نعم، المعهد معتمد من الهيئة القومية لضمان جودة التعليم والاعتماد، تحت إشراف وزارة التعليم العالي. الدرجة معادلة لدرجات الجامعات المصرية.",
  },
  {
    q: "هل يوجد تأجيل تجنيد؟",
    a: "نعم، يتم تأجيل التجنيد للطلاب حتى سن ٢٨ سنة وفقاً للقواعد المعمول بها.",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-paper">
      {/* Hero */}
      <section className="bg-forest text-paper relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-brand-green/40 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-gold/15 blur-3xl" />
        <div className="container mx-auto px-4 relative z-10 py-16 lg:py-20">
          <p className="text-xs text-gold tracking-[0.3em] uppercase mb-4 font-bold">Student Services</p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-5">الخدمات الطلابية</h1>
          <p className="text-lg text-paper/80 max-w-2xl leading-relaxed">
            دليل شامل للخدمات المقدمة لطلاب معهد راية العالي — من الإرشاد الأكاديمي إلى التدريب والتوظيف.
          </p>
        </div>
        <div className="absolute bottom-0 inset-x-0 z-10">
          <svg viewBox="0 0 1440 60" className="w-full h-[40px]" preserveAspectRatio="none" aria-hidden>
            <path d="M0 40 C 240 10 480 10 720 30 C 960 50 1200 50 1440 20 L 1440 60 L 0 60 Z" fill="var(--color-paper)" />
          </svg>
        </div>
      </section>

      {/* Services grid */}
      <section className="bg-paper py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s, i) => (
              <div key={i} className="group bg-white rounded-xl p-6 border border-border-warm hover:shadow-lg hover:border-gold/40 transition-all">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-forest/5 group-hover:bg-gold/10 transition-colors mb-4">
                  <s.icon className="h-6 w-6 text-forest group-hover:text-gold transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-forest mb-2">{s.title}</h3>
                <p className="text-sm text-[#5A6B66] leading-relaxed mb-3">{s.desc}</p>
                <div className="text-xs text-gold font-bold flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {s.contact}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-paper-warm py-12 border-y border-border-warm">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-gold/10 mb-4">
              <HelpCircle className="h-7 w-7 text-gold" />
            </div>
            <h2 className="text-3xl font-bold text-forest">الأسئلة الشائعة</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <details key={i} className="group bg-white rounded-lg border border-border-warm overflow-hidden">
                <summary className="flex items-center justify-between p-4 cursor-pointer font-bold text-forest text-sm hover:bg-paper-warm/50 transition-colors">
                  {faq.q}
                  <ArrowLeft className="h-4 w-4 text-gold group-open:rotate-[-90deg] transition-transform" />
                </summary>
                <div className="px-4 pb-4 text-sm text-[#5A6B66] leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-forest text-paper py-12">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-2xl font-bold mb-3">محتاج مساعدة؟</h2>
          <p className="text-paper/70 mb-6 text-sm">تواصل مع شؤون الطلاب وسنرد على استفسارك</p>
          <a href="/contact" className="inline-flex items-center gap-2 bg-gold hover:bg-[#A07B2E] text-white font-bold px-6 py-3 rounded-md transition-colors">
            تواصل معنا
          </a>
        </div>
      </section>

      <footer className="bg-forest text-paper py-6 border-t border-white/5">
        <div className="container mx-auto px-4 text-center text-xs text-paper/55">
          © راية المستقبل — الخدمات الطلابية
        </div>
      </footer>
    </div>
  );
}
