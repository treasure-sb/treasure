import FeaturedEvents from "@/components/landing-page/featured-events/FeaturedEvents";
import Hero from "@/components/landing-page/Hero";
import FAQ from "@/components/landing-page/FAQ";
import Footer from "@/components/shared/Footer";
import Features from "@/components/landing-page/cards/Features";

export default function Page() {
  return (
    <main>
      <Hero />
      <FeaturedEvents />
      <div className="w-full py-6 mt:24 md:mt-60">
        <div className="max-w-[var(--container-width)] m-auto">
          <h4 className="text-2xl md:text-5xl tracking-wide font-semibold mt-8 mb-12 text-center flex justify-center gap-2">
            Making conventions <span className="text-primary">easy.</span>
          </h4>
          <Features />
        </div>
      </div>
      <FAQ />
      <Footer />
    </main>
  );
}
