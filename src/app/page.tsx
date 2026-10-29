import Navbar from "@/components/raya/Navbar";
import Hero from "@/components/raya/Hero";
import MagazineSections from "@/components/raya/MagazineSections";
import Footer from "@/components/raya/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--paper)]">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <MagazineSections />
      </main>
      <Footer />
    </div>
  );
}
