import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div>
      <div className="flex-col gap-6 flex mx-auto mt-5 max-w-3xl bg-black p-8 rounded-sm border">
        <h1 className="text-3xl sm:text-4xl text-center text-primary font-bold">
          Congratulations!
        </h1>
        <p className="text-base text-center text-white">
          Thanks for upgrading to the Pro plan! You now have access to all of
          the following benefits.
        </p>
        <div className="flex flex-col w-full rounded-xl p-4 justify-center text-xl font-semibold items-center">
          <div className="flex items-center gap-5 w-full mb-2">
            <CheckCircle size={20} strokeWidth={3} className="text-white" />
            <p className="text-left text-white">Embedded Checkout</p>
          </div>
          <div className="flex items-center gap-5 w-full mb-2">
            <CheckCircle size={20} strokeWidth={3} className="text-white" />
            <p className="text-left text-white">5 Admin Accounts</p>
          </div>
          <div className="flex items-center gap-5 w-full mb-2">
            <CheckCircle size={20} strokeWidth={3} className="text-white" />
            <p className="text-left text-white">Daily Payouts</p>
          </div>
          <div className="flex items-center gap-5 w-full mb-2">
            <CheckCircle size={20} strokeWidth={3} className="text-white" />
            <p className="text-left text-white">2% Service Fees</p>
          </div>
        </div>
        <div className="flex gap-4 justify-center">
          <Link href="">
            <Button variant={"default"} className="text-xs sm:text-base">
              Create an event now
            </Button>
          </Link>
          <Link href="/host">
            <Button variant={"default"} className="text-xs sm:text-base">
              Host Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
