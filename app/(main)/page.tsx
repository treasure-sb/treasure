import CreateEvents from "@/components/landing-page/CreateEvents";
import FeaturedEvents from "@/components/landing-page/featured-events/FeaturedEvents";
import Hero from "@/components/landing-page/Hero";
import PreviewMore from "@/components/landing-page/PreviewMore";
import Quote from "@/components/landing-page/Quote";
import BookVendorTables from "@/components/landing-page/BookVendorTables";
import Questions from "@/components/landing-page/Questions";
import Reminders from "@/components/landing-page/Reminders";
import Order from "@/components/landing-page/Order";
import Footer from "@/components/shared/Footer";

export default function Page() {
  return (
    <main className="m-auto z-0">
      <Hero />
      <div className="relative z-10">
        <FeaturedEvents />
        <div className="max-w-6xl xl:max-w-7xl m-auto">
          <PreviewMore />
          <CreateEvents />
          <Quote />
          <BookVendorTables />
          <Order />
          <Reminders />
          <Questions />
          <Footer />
        </div>
      </div>
    </main>
  );
}
