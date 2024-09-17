import LandingButton from "./LandingButton";

export default function Join() {
  return (
    <div className="relative mx-[-16px] sm:mx-[-32px] py-16 md:py-28 overflow-hidden dark:text-background">
      <div className="absolute inset-0 bg-gradient-to-b from-[#F8E1BB] to-[#97DFFF]"></div>
      <div className="relative w-full md:max-w-4xl m-auto flex flex-col items-center justify-center px-6 space-y-6 md:space-y-10">
        <p className="text-[30px] md:text-4xl lg:text-6xl font-semibold text-center leading-10 md:leading-[1.5] lg:leading-[1.5]">
          Join the Fastest Growing Community for Card Shows and Hobby Events
        </p>
        <LandingButton href="/create" text="Create Your Event with Treasure" />
      </div>
    </div>
  );
}
