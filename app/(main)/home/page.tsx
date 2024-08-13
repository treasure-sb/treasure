import FeaturedEvents from "@/components/landing-page/featured-events/FeaturedEvents";
import Hero from "@/components/landing-page/Hero";
import Grid from "@/components/landing-page/grid/Grid";
import AllYourAttendees from "@/components/landing-page/AllYourAttendees";
import Footer from "@/components/shared/Footer";
import Free from "@/components/landing-page/Free";

export default function Page() {
  return (
    <main>
      <div className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#84C6E2] from-[22%] to-[#E0FFF6] mx-[-16px]">
        <Hero />
      </div>
      <FeaturedEvents />
      <div className="w-full py-6 mt:24 md:mt-60">
        <div className="max-w-[var(--container-width)] m-auto space-y-20 md:space-y-40">
          <Free />
          <AllYourAttendees />
          <Grid />
        </div>
      </div>
      <Footer />
    </main>
  );
}
