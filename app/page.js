import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Workbench from "@/components/Workbench";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="relative z-10">
      <Header />
      <main className="mx-auto max-w-6xl px-4 sm:px-6">
        <Hero />
        <Workbench />
      </main>
      <Footer />
    </div>
  );
}
