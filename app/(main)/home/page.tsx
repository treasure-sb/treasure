import FeaturedEvents from "@/components/landing-page/featured-events/FeaturedEvents";
import Hero from "@/components/landing-page/hero/Hero";
import Grid from "@/components/landing-page/grid/Grid";
import AllYourAttendees from "@/components/landing-page/AllYourAttendees";
import Footer from "@/components/shared/Footer";
import Free from "@/components/landing-page/Free";
import TrackSales from "@/components/landing-page/TrackSales";
import LetsGetPeople from "@/components/landing-page/LetsGetPeople";
import Join from "@/components/landing-page/Join";

export default function Page() {
  return (
    <main className="tracking-tight">
      <div className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:bg-none from-[#84C6E2] dark:from-[#5e90a5] from-[22%] via-[#84C6E2] dark:via-[#5e90a5] via-[22%] to-[#fdf9f2] dark:to-[#141414] to-[70%] mx-[-16px] sm:mx-[-32px] mt-[-80px] md:-mt-28">
        <Hero />
      </div>
      <div id="featured-events">
        <FeaturedEvents />
      </div>
      <div className="w-full py-6 mt:20 md:mt-20 space-y-20 md:space-y-20">
        <div className="max-w-[var(--container-width)] m-auto">
          <Free />
        </div>
        <TrackSales />
        <div className="max-w-[var(--container-width)] m-auto space-y-20 md:space-y-20">
          <AllYourAttendees />
          <Grid />
          <LetsGetPeople />
        </div>
        <Join />
      </div>
      <Footer />
    </main>
  );
}
