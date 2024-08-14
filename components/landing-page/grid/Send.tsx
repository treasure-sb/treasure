import { Button } from "@/components/ui/button";
import Link from "next/link";
import LandingButton from "../LandingButton";

export default function Send() {
  return (
    <div className="col-span-1 bg-[#ACF2D6] dark:bg-green-600 p-6 lg:p-10 rounded-2xl flex flex-col justify-between ">
      <p className="text-2xl font-semibold lg:text-4xl 2xl:text-[2.88rem]">
        Send Unlimited Free Texts & Emails
      </p>
      <div className="flex flex-row my-8">
        <div className="bg-gray-900 border-2 border-slate-300 p-4 rounded-2xl text-sm text-muted-foreground">
          <p>Our show is coming up in one week!</p>
          <br />
          <p>Here are the set-up instructions when you arrive:</p>
        </div>
      </div>
      <div className="space-y-4">
        <p className="text-sm lg:text-base 2xl:text-2xl">
          Most emails don’t get opened. Send texts with emails to best re-engage
          customers.
        </p>
        <LandingButton
          href="https://app.formbricks.com/s/clz90def600006xxfp1ewje9i"
          text="Create Your Event"
        />
      </div>
    </div>
  );
}
