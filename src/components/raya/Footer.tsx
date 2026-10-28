"use client";

import { useState } from "react";
import { Send, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function Footer() {
  const [email, setEmail] = useState("");

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("تم اشتراكك بنجاح! ستصلك آخر الأخبار والإصدارات على بريدك.");
    setEmail("");
  };

  return (
    <footer id="contact" className="bg-[#06241D] text-white">
      {/* Subscribe strip */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-10">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="heading-display text-2xl md:text-3xl text-white mb-2">
                اشترك في نشرتنا البريدية
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                كن أول من يعرف عن الأعداد الجديدة، الفعاليات، والدعوات للمشاركة في المجلة.
              </p>
            </div>
            <form onSubmit={subscribe} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="بريدك الإلكتروني"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-[#E69744] h-12 rounded-md"
              />
              <Button
                type="submit"
                className="bg-[#E69744] hover:bg-[#C77B2E] text-white font-bold h-12 px-6 rounded-md whitespace-nowrap"
              >
                <Send className="h-4 w-4 ml-1" />
                اشترك الآن
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-14 w-14 rounded-full overflow-hidden shadow-md ring-2 ring-[#E69744]/40 bg-white">
                <img
                  src="/raya-logo.jpeg"
                  alt="شعار راية المستقبل"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="heading-display text-xl">راية المستقبل</div>
                <div className="text-[10px] tracking-[0.2em] text-[#E69744] uppercase">
                  RAYA FUTURE
                </div>
              </div>
            </div>
            <p className="text-white/65 text-sm leading-relaxed mb-5 max-w-sm">
              مجلة طلابية إلكترونية تابعة لمعهد راية العالي، تجمع الصوت المؤسسي بالحياة
              الطلابية، وتحوّل الأنشطة والإنجازات إلى أرشيف حيّ يمكن الرجوع إليه وتطويره.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/share/1Duv3juc3d/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="h-9 w-9 rounded-full bg-white/5 hover:bg-[#E69744] flex items-center justify-center transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
              {[Instagram, Linkedin, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="social"
                  className="h-9 w-9 rounded-full bg-white/5 hover:bg-[#E69744] flex items-center justify-center transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links: Magazine */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm">المجلة</h4>
            <ul className="space-y-2.5 text-sm text-white/65">
              <li><a href="#about" className="hover:text-[#E69744] transition-colors">عن المجلة</a></li>
              <li><a href="#leadership" className="hover:text-[#E69744] transition-colors">كلمات القيادات</a></li>
              <li><a href="#sections" className="hover:text-[#E69744] transition-colors">أقسام المجلة</a></li>
              <li><a href="#issues" className="hover:text-[#E69744] transition-colors">الإصدارات</a></li>
              <li><a href="#gallery" className="hover:text-[#E69744] transition-colors">معرض الوسائط</a></li>
            </ul>
          </div>

          {/* Links: Participate */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm">المشاركة</h4>
            <ul className="space-y-2.5 text-sm text-white/65">
              <li><a href="#contribute" className="hover:text-[#E69744] transition-colors">شارك معنا</a></li>
              <li><a href="#" className="hover:text-[#E69744] transition-colors">فريق التحرير</a></li>
              <li><a href="#" className="hover:text-[#E69744] transition-colors">سياسة النشر</a></li>
              <li><a href="#" className="hover:text-[#E69744] transition-colors">حقوق المساهمين</a></li>
              <li><a href="#" className="hover:text-[#E69744] transition-colors">الانضمام للفريق</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-bold text-white mb-4 text-sm">تواصل معنا</h4>
            <ul className="space-y-3 text-sm text-white/65">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#E69744] mt-0.5 flex-shrink-0" />
                <span>معهد راية العالي — القاهرة، جمهورية مصر العربية</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#E69744] flex-shrink-0" />
                <a href="mailto:magazine@raya.edu" className="hover:text-[#E69744]">
                  magazine@raya.edu
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#E69744] flex-shrink-0" />
                <span dir="ltr">+20 2 0000 0000</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-[12px] text-white/55">
          <div>
            © ٢٠٢٦ مجلة راية المستقبل — معهد راية العالي. جميع الحقوق محفوظة.
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-[#E69744] transition-colors">سياسة الخصوصية</a>
            <span className="opacity-30">|</span>
            <a href="#" className="hover:text-[#E69744] transition-colors">شروط الاستخدام</a>
            <span className="opacity-30">|</span>
            <a href="#" className="hover:text-[#E69744] transition-colors">خريطة الموقع</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
