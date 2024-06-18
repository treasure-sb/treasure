import FeaturedEvents from "@/components/landing-page/featured-events/FeaturedEvents";
import Hero from "@/components/landing-page/Hero";
import FAQ from "@/components/landing-page/FAQ";
import Footer from "@/components/shared/Footer";
import Plan from "@/components/landing-page/sections/Plan";
import Preview from "@/components/landing-page/sections/Preview";
import Process from "@/components/landing-page/sections/Process";

export default function Page() {
  return (
    <main>
      <Hero />
      <FeaturedEvents />
      <div className="w-full py-6 mt:24 md:mt-60 max-w-[var(--container-width)] mx-auto space-y-40">
        <Plan />
        <Preview />
        <Process />
      </div>
      <FAQ />
      <div className="mt-10">
        <Footer />
      </div>
    </main>
  );
}
