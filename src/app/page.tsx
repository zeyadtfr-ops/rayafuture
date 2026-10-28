import Navbar from "@/components/raya/Navbar";
import Hero from "@/components/raya/Hero";
import NewsSection from "@/components/raya/NewsSection";
import ThreeColumnSection from "@/components/raya/ThreeColumnSection";
import BottomSection from "@/components/raya/BottomSection";
import Footer from "@/components/raya/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBF4ED]">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <NewsSection />
        <ThreeColumnSection />
        <BottomSection />
      </main>
      <Footer />
    </div>
  );
}
