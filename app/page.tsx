import { Button } from "@/components/ui/button";
import FeaturedEvents from "@/components/landing-page/FeaturedEvents";
import Newsletter from "@/components/landing-page/Newsletter";
import Link from "next/link";

export default async function Page() {
  return (
    <main className="max-w-xl md:max-w-6xl xl:max-w-7xl m-auto">
      {/* Hero */}
      <div className="my-20 space-y-10 w-full">
        <div className="max-w-xl">
          <h1 className="text-6xl md:text-8xl font-bold text-left mb-6 max-w-xs md:max-w-full">
            Find Great Card & Collectible{" "}
            <span className="text-primary">Events</span> Near You
          </h1>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <Link href="/events">
              <Button
                variant={"secondary"}
                className="w-full landing-page-button md:w-60"
              >
                Browse Events
              </Button>
            </Link>
            <Link href="/profile/create-event">
              <Button
                variant={"secondary"}
                className="w-full border-primary landing-page-button hover:bg-background bg-background md:w-60"
              >
                Create Event
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <FeaturedEvents />
      <Newsletter />
    </main>
  );
}
