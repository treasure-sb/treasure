import LandingButton from "@/components/landing-page/LandingButton";
import AllEvents from "./components/AllEvents";

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full justify-between">
        <h1 className="font-semibold text-3xl mb-4">My Events</h1>
        <LandingButton href="/create" text="Create Event" />
      </div>
      <AllEvents />
    </div>
  );
}
