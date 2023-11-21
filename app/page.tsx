import validateUser from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import FeaturedEvents from "@/components/landing-page/FeaturedEvents";
import Newsletter from "@/components/landing-page/Newsletter";

export default async function Page() {
  return (
    <main className="min-h-screen max-w-xl md:max-w-6xl xl:max-w-[90rem] m-auto">
      {/* Hero */}
      <div className="my-20 space-y-10 w-full">
        <div className="max-w-xl">
          <h1 className="text-5xl md:text-8xl font-bold text-left mb-6">
            Find Great Card & Collectible{" "}
            <span className="text-primary">Events</span> Near You
          </h1>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <Button
              variant={"secondary"}
              className="w-full landing-page-button"
            >
              Browse Events
            </Button>
            <Button
              variant={"secondary"}
              className="w-full border-primary landing-page-button hover:bg-background bg-background"
            >
              Create Event
            </Button>
          </div>
        </div>
      </div>
      <FeaturedEvents />
      <Newsletter />
    </main>
  );
}
