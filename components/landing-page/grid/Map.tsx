import Image from "next/image";
import LandingButton from "../LandingButton";

export default function Map() {
  return (
    <div className="col-span-1 flex flex-col-reverse lg:col-span-2 lg:flex-row bg-[#F8D57E] dark:bg-tertiary p-6 lg:p-10 rounded-2xl">
      <div className="flex flex-col justify-between lg:w-1/2 lg:pr-6 space-y-4">
        <p className="text-2xl font-semibold lg:text-4xl 2xl:text-[2.88rem]">
          Map Your Vendors & Attractions
        </p>
        <div className="space-y-4">
          <p className="text-sm lg:text-base 2xl:text-2xl">
            Assign vendors to specific locations and attractions on your event.
          </p>
          <LandingButton
            className="bg-[#7DD9E8] hover:bg-[#7DD9E8]/90"
            href="https://app.formbricks.com/s/clz90def600006xxfp1ewje9i"
            text="Create Your Event"
          />
        </div>
      </div>
      <div className="lg:w-1/2 mb-10 lg:mb-0">
        <Image
          className="w-full h-auto object-contain ml-6 lg:ml-10"
          quality={100}
          priority
          src="/static/landing-page/grid/map.png"
          alt="hero image"
          width={600}
          height={600}
        />
      </div>
    </div>
  );
}
