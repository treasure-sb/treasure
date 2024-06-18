import { LucideArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Preview() {
  return (
    <div className="space-y-6 md:flex md:flex-row md:justify-between md:space-y-0 md:max-w-7xl mx-auto md:space-x-10">
      <Image
        className="w-full h-full md:w-1/2 md:h-1/2 md:max-w-[32rem] md:max-h-[32rem] rounded-md max-w-md mx-auto md:mx-0"
        src="/static/landing-page/preview.png"
        alt="preview vendors and guests"
        width={1000}
        height={1000}
      />
      <div className="space-y-4 flex flex-col justify-center">
        <h2 className="text-2xl md:text-3xl">
          Preview Vendors & Special Guests
        </h2>
        <p className="text-muted-foreground md:text-xl md:max-w-xl">
          Explore event programming ahead of time on our modern, customizable
          event pages.
        </p>
        <Link
          href="/events"
          className="w-fit flex items-center space-x-1 md:space-x-2 group"
        >
          <p className="text-primary font-semibold text-2xl group-hover:text-primary/80 transition duration-300">
            Browse Events Now
          </p>
          <LucideArrowUpRight
            size={30}
            className="text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition duration-300 group-hover:text-primary/80"
          />
        </Link>
      </div>
    </div>
  );
}
