import FeaturedEvents from "@/components/landing-page/featured-events/FeaturedEvents";
import Newsletter from "@/components/landing-page/Newsletter";
import Hero from "@/components/landing-page/Hero";
import PreviewMore from "@/components/landing-page/preview/PreviewMore";
import Quote from "@/components/landing-page/Quote";
import BookVendorTables from "@/components/landing-page/book-tables/BookVendorTables";

export default function Page() {
  return (
    <main className="m-auto">
      <Hero />
      <div className="relative z-10">
        <FeaturedEvents />
        <div className="max-w-6xl xl:max-w-7xl m-auto">
          <PreviewMore />
          <Newsletter />
        </div>
        <Quote />
        <div className="max-w-6xl xl:max-w-7xl m-auto">
          <BookVendorTables />
        </div>
      </div>
    </main>
  );
}
