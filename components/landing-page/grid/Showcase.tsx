import Image from "next/image";
import LandingButton from "../LandingButton";

export default function Showcase() {
  return (
    <div className="col-span-1 flex flex-col-reverse lg:col-span-3 lg:flex-row bg-[#7DD9E8] dark:bg-blue-400 p-6 lg:p-10 rounded-2xl overflow-hidden">
      <div className="flex flex-col justify-between lg:w-1/2 lg:pr-6 space-y-4">
        <p className="text-2xl font-semibold lg:text-4xl 2xl:text-[2.88rem]">
          Showcase Your Vendors & Special Guests
        </p>
        <div className="space-y-4">
          <p className="text-sm lg:text-base 2xl:text-2xl">
            Send invites and event updates to re-engage customers directly from
            your dashboard. Create custom groups by event category & attendance.
          </p>
          <LandingButton
            variant="tertiary"
            href="https://app.formbricks.com/s/clz90def600006xxfp1ewje9i"
            text="Create Your Event"
          />
        </div>
      </div>
      <div className="w-fit mb-10 lg:mb-0 flex items-center justify-center mx-auto relative">
        <Image
          className="w-full h-80 lg:h-[28rem] object-contain scale-110 2xl:scale-[1.75] 2xl:translate-y-[30%] z-10"
          quality={100}
          priority
          src="/static/landing-page/grid/phone.png"
          alt="hero image"
          width={600}
          height={600}
        />
        <Image
          className="w-full h-80 lg:h-[28rem] object-contain transform translate-y-[-20%] 2xl:ml-16 scale-110 2xl:scale-[1.50] 2xl:translate-y-[-20%]"
          quality={100}
          priority
          src="/static/landing-page/grid/phone_guest.png"
          alt="hero image"
          width={600}
          height={600}
        />
      </div>
    </div>
  );
}
