import CreateEvents from "@/components/landing-page/CreateEvents";
import FeaturedEvents from "@/components/landing-page/featured-events/FeaturedEvents";
import Hero from "@/components/landing-page/Hero";
import PreviewMore from "@/components/landing-page/PreviewMore";
import Quote from "@/components/landing-page/Quote";
import BookVendorTables from "@/components/landing-page/BookVendorTables";
import FAQ from "@/components/landing-page/FAQ";
import Reminders from "@/components/landing-page/Reminders";
import Order from "@/components/landing-page/Order";
import Footer from "@/components/shared/Footer";
import Features from "@/components/landing-page/features/Features";

export default function Page() {
  return (
    <main>
      <Hero />
      <FeaturedEvents />
      <div className="w-full py-6 lg:-mb-80">
        <div className="max-w-6xl xl:max-w-7xl m-auto">
          {/* <PreviewMore />
        <CreateEvents />
        <Quote />
        <BookVendorTables />
        <Order />
        <Reminders /> */}
          <h1 className="text-2xl md:text-4xl tracking-wide font-semibold mt-8 mb-12 text-center flex justify-center gap-2">
            <p>
              Making conventions <span className="text-primary">easy.</span>
            </p>
          </h1>
          <Features />
        </div>
      </div>

      <FAQ />
      <Footer />
    </main>
  );
}
