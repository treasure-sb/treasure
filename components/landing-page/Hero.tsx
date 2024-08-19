"use client";

import { ChevronDown } from "lucide-react";
import Image from "next/image";
import LandingButton from "./LandingButton";

export default function Hero() {
  const scrollToNextSection = () => {
    const nextSection = document.getElementById("featured-events");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="max-w-[var(--container-width)] mx-auto min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 py-8 lg:py-12">
      <div className="flex flex-col-reverse lg:flex-row lg:items-center lg:justify-between w-full">
        <div className="w-full lg:w-1/2 flex flex-col space-y-6 mt-8 lg:mt-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl 2xl:text-[5.25rem] font-semibold text-left 2xl:leading-[1.05]">
            Find More Hobby Events You Love{" "}
            <span className="text-[#2AAA88]">Every Weekend</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-light text-left">
            Join the #1 community for card shows and hobby events.
            <br className="hidden sm:block" />
            We make getting tickets and tables easy.
          </p>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <LandingButton href="/login" text="Get Started Now" />
            <LandingButton
              href="/events"
              text="Browse Events"
              variant="outline"
            />
          </div>
        </div>
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <Image
            className="object-contain w-full h-auto max-w-[18rem] md:max-w-xl 2xl:max-w-2xl"
            quality={100}
            priority
            src="/static/landing-page/hero_image.png"
            alt="hero image"
            width={2000}
            height={2000}
          />
        </div>
      </div>
    </section>
  );
}
