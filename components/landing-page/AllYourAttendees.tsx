import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

export default function AllYourAttendees() {
  return (
    <div className="flex flex-col-reverse lg:col-span-2 lg:flex-row lg:justify-between p-6 lg:p-10">
      <div className="flex flex-col justify-between lg:w-1/2 lg:pr-6 space-y-4 lg:py-12">
        <p className="text-2xl font-semibold lg:text-4xl 2xl:text-6xl">
          All Your Attendees & Vendors in One Place
        </p>
        <div className="space-y-4">
          <p className="text-sm lg:text-base 2xl:text-3xl mb-10">
            Send invites and event updates to re-engage customers directly from
            your dashboard. Create custom groups by event category & attendance.
          </p>
          <Button size={"landing"} asChild>
            <Link href="https://app.formbricks.com/s/clz90def600006xxfp1ewje9i">
              Create Your Event
            </Link>
          </Button>
        </div>
      </div>
      <Image
        className="w-full h-auto md:w-3/4 lg:w-1/2 2xl:w-[36rem] rounded-2xl object-contain mb-10 md:ml-auto"
        quality={100}
        priority
        src="/static/landing-page/attendees.png"
        alt="attendees"
        width={600}
        height={600}
      />
    </div>
  );
}
