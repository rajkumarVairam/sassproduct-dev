import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { CodeShowcase, TechStack, Infrastructure } from "@/components/content-sections";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main id="main-content" className="flex-1">
        <Hero />
        <Features />
        <CodeShowcase />
        <TechStack />
        <Infrastructure />
      </main>
      <Footer />
    </div>
  );
}
