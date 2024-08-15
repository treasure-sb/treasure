import FeaturedEvents from "@/components/landing-page/featured-events/FeaturedEvents";
import Hero from "@/components/landing-page/Hero";
import Grid from "@/components/landing-page/grid/Grid";
import AllYourAttendees from "@/components/landing-page/AllYourAttendees";
import Footer from "@/components/shared/Footer";
import Free from "@/components/landing-page/Free";
import TrackSales from "@/components/landing-page/TrackSales";

export default function Page() {
  return (
    <main>
      <div className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#84C6E2] from-[22%] to-[#E0FFF6] relative mx-[-16px] sm:mx-[-32px] max-w-[100vw]">
        <Hero />
      </div>
      <div id="featured-events">
        <FeaturedEvents />
      </div>

      <div className="w-full py-6 mt:20 md:mt-40 space-y-20 md:space-y-40">
        <div className="max-w-[var(--container-width)] m-auto">
          <Free />
        </div>
        <TrackSales />
        <div className="max-w-[var(--container-width)] m-auto space-y-20 md:space-y-40">
          <AllYourAttendees />
          <Grid />
        </div>
      </div>
      <Footer />
    </main>
  );
}
