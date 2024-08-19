"use client";

import LandingButton from "../LandingButton";
import HeroImage from "./HeroImage";

export default function Hero() {
  return (
    <section className="max-w-[var(--container-width)] px-4 sm:px-6 py-8 lg:py-12">
      <div className="flex flex-col justify-between mx-auto min-h-screen">
        <HeroImage />
        <div className="w-full flex flex-col space-y-6 mb-14">
          <h1 className="text-xl sm:text-2xl md:text-5xl lg:text-6xl 2xl:text-[5.25rem] font-semibold text-left 2xl:leading-[1.05]">
            Find More Hobby Events You Love{" "}
            <span className="text-[#2AAA88]">Every Weekend</span>
          </h1>
          <p className="text-sm sm:text-lg md:text-xl lg:text-2xl font-light text-left">
            Join the #1 community for card shows and hobby events.
            <br className="hidden sm:block" />
            We make getting tickets and tables easy.
          </p>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <LandingButton href="/login" text="Get Started Now" />
            <LandingButton
              href="/events"
              text="Browse Events"
              variant="outline"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
