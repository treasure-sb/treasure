"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="h-[100svh] relative mx-[-16px] sm:mx-[-32px] flex items-center justify-center -mt-32 px-4 sm:px-8">
      <div className="flex flex-col items-center space-y-4 md:space-y-12 md:max-w-6xl xl:max-w-7xl m-auto tracking-tight">
        <p className="text-[2.4rem] font-extrabold text-center leading-tight md:leading-tight md:text-6xl md:max-w-6xl ">
          Find the Best <span className="text-primary">Sports</span>,{" "}
          <span className="text-primary">Pokemon</span>, and{" "}
          <span className="text-primary">TCG</span> Events Near You
        </p>
        <Link href="/events" className="w-fit">
          <Button className="w-40 md:w-60 md:h-16 md:text-xl">
            Browse Events
          </Button>
        </Link>
      </div>
      <Image
        className="-z-50 absolute inset-0 opacity-100"
        width={0}
        height={0}
        layout="fill"
        objectFit="cover"
        objectPosition="center"
        quality={100}
        alt="hero-image"
        src={"/static/landing-page/sports_best.jpg"}
      />
      <div className="bg-gradient-to-b from-transparent to-[#131313] absolute inset-x-0 bottom-0 h-2/5 -z-40" />
    </section>
  );
}
