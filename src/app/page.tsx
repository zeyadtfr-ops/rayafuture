import Navbar from "@/components/raya/Navbar";
import Hero from "@/components/raya/Hero";
import NewsSection from "@/components/raya/NewsSection";
import ThreeColumnSection from "@/components/raya/ThreeColumnSection";
import BottomSection from "@/components/raya/BottomSection";
import Footer from "@/components/raya/Footer";
import { Download } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBF4ED]">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <NewsSection />
        <ThreeColumnSection />
        <BottomSection />

        {/* Download project ZIP — temporary banner */}
        <section className="py-10 bg-[#0A382F] border-t border-white/10">
          <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-right">
              <h3 className="heading-display text-white text-2xl mb-1">
                حمّل كود المشروع كامل
              </h3>
              <p className="text-white/70 text-sm">
                ملف ZIP جاهز — فك الضغط واكتب <code className="bg-white/10 px-1.5 py-0.5 rounded text-[#E69744]">npm install</code> ثم <code className="bg-white/10 px-1.5 py-0.5 rounded text-[#E69744]">npm run dev</code>
              </p>
            </div>
            <a
              href="/raya-magazine.zip"
              download
              className="inline-flex items-center gap-2 bg-[#E69744] hover:bg-[#C77B2E] text-white font-bold rounded-md px-6 py-3 transition-colors shadow-lg shadow-[#E69744]/20"
            >
              <Download className="h-5 w-5" />
              تحميل raya-magazine.zip
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
