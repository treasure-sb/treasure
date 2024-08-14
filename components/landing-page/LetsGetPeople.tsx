import Image from "next/image";
import LandingButton from "./LandingButton";

export default function LetsGetPeople() {
  return (
    <div className="flex flex-col-reverse lg:col-span-2 lg:flex-row lg:justify-between p-6 lg:p-10">
      <div className="flex flex-col justify-between lg:w-1/2 lg:pr-20 space-y-4 lg:py-12">
        <p className="text-2xl font-semibold lg:text-4xl 2xl:text-6xl">
          Let's Get People Out More
        </p>
        <div className="space-y-4">
          <p className="text-sm lg:text-base 2xl:text-3xl mb-10">
            We grew up collecting cards, sneakers, and comic books. We love
            going to conventions but the logistics are not always easy. So we
            started Treasure to help more people get to shows and love the hobby
            like we do.
          </p>
          <div className="flex space-x-4">
            <LandingButton
              variant="tertiary"
              href="/login"
              text="Get Started with Treasure"
            />
          </div>
        </div>
      </div>
      <Image
        className="w-full h-auto md:w-[60%] lg:w-1/2 2xl:w-[36rem] rounded-2xl object-contain mb-10 md:ml-auto"
        quality={100}
        priority
        src="/static/landing-page/about_us.png"
        alt="about us"
        width={600}
        height={600}
      />
    </div>
  );
}
