import { LucideArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Process() {
  return (
    <div className="space-y-6 md:flex md:flex-row-reverse md:justify-between md:space-y-0 md:max-w-7xl mx-auto">
      <div className="relative w-full h-full md:w-1/2 md:max-w-[32rem]">
        <Image
          className="w-full h-full md:w-full md:h-auto max-w-md mx-auto md:max-w-none md:mx-0"
          src="/static/landing-page/vendor-app.png"
          alt="phone mock"
          width={1000}
          height={1000}
        />
        <Image
          className="w-full h-full md:w-60 md:h-auto absolute -bottom-10 -left-20 z-10 hidden md:block"
          src="/static/landing-page/vendor-app-review.png"
          alt="phone mock"
          width={1000}
          height={1000}
        />
      </div>
      <div className="space-y-4 flex flex-col justify-center">
        <h2 className="text-2xl md:text-3xl md:max-w-[16rem] lg:max-w-none">
          Process vendor applications and manage payments
        </h2>
        <p className="text-muted-foreground md:text-xl md:max-w-[20rem] lg:max-w-xl">
          Track every vendor application and payment to build your event with
          ease.
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
