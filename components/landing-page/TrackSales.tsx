import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

export default function TrackSales() {
  return (
    <div className="relative mx-[-16px] sm:mx-[-32px] py-16 overflow-hidden dark:text-background">
      <div className="absolute inset-0 bg-gradient-to-b from-[#F8E1BB] to-[#97DFFF]"></div>
      <div className="relative max-w-[var(--container-width)] m-auto flex flex-col lg:col-span-2 lg:flex-row lg:justify-between p-6 lg:p-10">
        <Image
          className="w-full h-auto md:w-3/4 lg:w-1/2 2xl:w-[36rem] rounded-2xl object-contain mb-10"
          quality={100}
          priority
          src="/static/landing-page/dashboard.png"
          alt="host dashboard"
          width={600}
          height={600}
        />
        <div className="flex flex-col justify-between lg:w-1/2 lg:pl-6 space-y-4 lg:py-12">
          <p className="text-2xl font-semibold lg:text-4xl 2xl:text-5xl">
            Track Sales & Get Paid Daily
          </p>
          <div className="space-y-4">
            <p className="text-sm lg:text-base 2xl:text-2xl">
              Sell tickets and charge vendors the moment you start promoting
              your event. Get access to more funds well in advance.
            </p>
            <Button variant={"tertiary"} size={"landing"} asChild>
              <Link href="https://app.formbricks.com/s/clz90def600006xxfp1ewje9i">
                Create Your Event
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}