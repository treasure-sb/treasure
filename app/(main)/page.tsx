import FeaturedEvents from "@/components/landing-page/FeaturedEvents";
import Newsletter from "@/components/landing-page/Newsletter";
import Hero from "@/components/landing-page/Hero";

export default function Page() {
  return (
    <main className="max-w-xl md:max-w-6xl m-auto">
      <Hero />
      <FeaturedEvents />
      <Newsletter />
    </main>
  );
}
