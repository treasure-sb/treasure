import Image from "next/image";
import LandingButton from "./LandingButton";

export default function Free() {
  return (
    <div className="flex flex-col-reverse lg:col-span-2 lg:flex-row lg:justify-between">
      <div className="flex flex-col justify-between lg:w-1/2 lg:pr-20 space-y-4">
        <p className="text-2xl font-semibold lg:text-4xl 2xl:text-6xl">
          Free for Event Organizers, Forever
        </p>
        <div className="space-y-4">
          <p className="text-sm lg:text-base 2xl:text-3xl mb-10">
            The #1 way to sell your tickets and vendor tables online. No fee on
            any sale for organizers. Launch your event in under 5 minutes.
          </p>
          <div className="flex space-x-4">
            <LandingButton
              href="https://app.formbricks.com/s/clz90def600006xxfp1ewje9i"
              text="Create Your Event"
            />
            <LandingButton
              href="/events"
              text="Browse Events"
              variant={"outline"}
            />
          </div>
        </div>
      </div>
      <Image
        className="w-full h-auto md:w-[60%] lg:w-1/2 2xl:w-[36rem] rounded-2xl object-contain mb-10 md:ml-auto"
        quality={100}
        priority
        src="/static/landing-page/free.png"
        alt="attendees"
        width={600}
        height={600}
      />
    </div>
  );
}
