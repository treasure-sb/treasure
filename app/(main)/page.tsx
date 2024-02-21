import FeaturedEvents from "@/components/landing-page/FeaturedEvents";
import Newsletter from "@/components/landing-page/Newsletter";
import Hero from "@/components/landing-page/Hero";

export default function Page() {
  return (
    <main className="m-auto z-0">
      <Hero />
      <div className="relative z-10">
        <FeaturedEvents />
        <div className="max-w-6xl xl:max-w-7xl m-auto">
          <Newsletter />
        </div>
      </div>
    </main>
  );
}
