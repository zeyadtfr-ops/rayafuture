"use client";

import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Facebook,
  Send,
  CheckCircle2,
  Clock,
  User,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, phone, subject, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "فشل الإرسال");
      toast.success("تم إرسال رسالتك بنجاح! سنرد عليك قريباً.");
      setSent(true);
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper">
      {/* ════════════ HERO ════════════ */}
      <section className="bg-forest text-paper relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <defs>
            <pattern id="c-pat" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M40 0 L80 40 L40 80 L0 40 Z" fill="none" stroke="#C9A04A" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#c-pat)" />
        </svg>
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-brand-green/40 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-gold/15 blur-3xl" />

        <div className="container mx-auto px-4 relative z-10 py-16 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-xs text-gold tracking-[0.3em] uppercase mb-4 font-bold">
              Contact Us
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold leading-[1.1] mb-5">
              تواصل معنا
            </h1>
            <p className="text-lg text-paper/80 mb-8 leading-relaxed max-w-2xl">
              نسعد بتلقي استفساراتك واقتراحاتك. أرسل لنا رسالة وسنرد عليك في أقرب وقت ممين.
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 z-10">
          <svg viewBox="0 0 1440 60" className="w-full h-[40px]" preserveAspectRatio="none" aria-hidden>
            <path d="M0 40 C 240 10 480 10 720 30 C 960 50 1200 50 1440 20 L 1440 60 L 0 60 Z" fill="var(--color-paper)" />
          </svg>
        </div>
      </section>

      {/* ════════════ CONTACT INFO + FORM ════════════ */}
      <section className="bg-paper py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact info cards */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-forest mb-4">معلومات التواصل</h2>

              <div className="bg-white rounded-xl p-5 border border-border-warm flex items-start gap-4">
                <div className="inline-flex items-center justify-center h-11 w-11 rounded-lg bg-forest/5 flex-shrink-0">
                  <MapPin className="h-5 w-5 text-forest" />
                </div>
                <div>
                  <h3 className="font-bold text-forest text-sm mb-1">العنوان</h3>
                  <p className="text-xs text-[#5A6B66] leading-relaxed">
                    دمياط الجديدة، الحي الثاني،<br />أمام نادي المستقبل
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-border-warm flex items-start gap-4">
                <div className="inline-flex items-center justify-center h-11 w-11 rounded-lg bg-forest/5 flex-shrink-0">
                  <Phone className="h-5 w-5 text-forest" />
                </div>
                <div>
                  <h3 className="font-bold text-forest text-sm mb-1">الهاتف / واتساب</h3>
                  <p className="text-xs text-[#5A6B66]" dir="ltr">01030830822</p>
                  <p className="text-xs text-[#5A6B66] mt-0.5">واتساب: <span dir="ltr">01030830811</span></p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-border-warm flex items-start gap-4">
                <div className="inline-flex items-center justify-center h-11 w-11 rounded-lg bg-forest/5 flex-shrink-0">
                  <Mail className="h-5 w-5 text-forest" />
                </div>
                <div>
                  <h3 className="font-bold text-forest text-sm mb-1">البريد الإلكتروني</h3>
                  <a href="mailto:rayaedu2@gmail.com" className="text-xs text-gold hover:underline" dir="ltr">
                    rayaedu2@gmail.com
                  </a>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-border-warm flex items-start gap-4">
                <div className="inline-flex items-center justify-center h-11 w-11 rounded-lg bg-forest/5 flex-shrink-0">
                  <Globe className="h-5 w-5 text-forest" />
                </div>
                <div>
                  <h3 className="font-bold text-forest text-sm mb-1">روابط رسمية</h3>
                  <a href="https://raya.edu.eg" target="_blank" rel="noopener noreferrer" className="text-xs text-gold hover:underline block" dir="ltr">
                    raya.edu.eg
                  </a>
                  <a href="https://www.facebook.com/share/1Duv3juc3d/" target="_blank" rel="noopener noreferrer" className="text-xs text-gold hover:underline flex items-center gap-1 mt-1">
                    <Facebook className="h-3 w-3" /> صفحة الفيسبوك
                  </a>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-border-warm flex items-start gap-4">
                <div className="inline-flex items-center justify-center h-11 w-11 rounded-lg bg-forest/5 flex-shrink-0">
                  <Clock className="h-5 w-5 text-forest" />
                </div>
                <div>
                  <h3 className="font-bold text-forest text-sm mb-1">ساعات العمل</h3>
                  <p className="text-xs text-[#5A6B66]">الأحد - الخميس</p>
                  <p className="text-xs text-[#5A6B66]">٩ صباحاً - ٤ عصراً</p>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-8 border border-border-warm shadow-sm">
                <h2 className="text-2xl font-bold text-forest mb-2">أرسل رسالة</h2>
                <p className="text-sm text-[#5A6B66] mb-6">
                  املأ النموذج التالي وسنتواصل معك في أقرب وقت.
                </p>

                {sent ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center mb-6">
                    <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-green-800 mb-1">تم إرسال رسالتك!</h3>
                    <p className="text-sm text-green-700">شكراً لتواصلك معنا. سنرد عليك قريباً.</p>
                    <button
                      onClick={() => setSent(false)}
                      className="mt-4 text-sm text-green-700 hover:underline font-medium"
                    >
                      إرسال رسالة أخرى
                    </button>
                  </div>
                ) : (
                  <form onSubmit={submit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold mb-1 text-forest">
                          <User className="h-3.5 w-3.5 inline ml-1" />
                          الاسم *
                        </label>
                        <Input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="اسمك الكامل"
                          required
                          className="h-11 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-1 text-forest">
                          <Mail className="h-3.5 w-3.5 inline ml-1" />
                          البريد الإلكتروني *
                        </label>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="email@example.com"
                          required
                          className="h-11 rounded-md"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold mb-1 text-forest">
                          <Phone className="h-3.5 w-3.5 inline ml-1" />
                          الهاتف (اختياري)
                        </label>
                        <Input
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="01000000000"
                          className="h-11 rounded-md"
                          dir="ltr"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-1 text-forest">
                          <MessageSquare className="h-3.5 w-3.5 inline ml-1" />
                          الموضوع *
                        </label>
                        <Input
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          placeholder="موضوع الرسالة"
                          required
                          className="h-11 rounded-md"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-1 text-forest">
                        الرسالة *
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="اكتب رسالتك هنا..."
                        required
                        rows={6}
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-y leading-relaxed focus:outline-none focus:border-gold"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 bg-forest hover:bg-brand-green text-paper font-bold rounded-md"
                    >
                      <Send className="h-4 w-4 ml-1.5" />
                      {loading ? "جارٍ الإرسال..." : "إرسال الرسالة"}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ FOOTER ════════════ */}
      <footer className="bg-forest text-paper py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-xs text-paper/55">
          © راية المستقبل — معهد راية العالي. جميع الحقوق محفوظة.
        </div>
      </footer>
    </div>
  );
}
