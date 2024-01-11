import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Page() {
  return (
    <main className="m-auto max-w-lg">
      <div className="flex flex-col space-y-6">
        <h1 className="text-2xl m-auto font-semibold text-center">
          Host / Vendor's Corner
        </h1>
        <Link href="/vendors/sales" className="">
          <Button className="w-full">Sales</Button>
        </Link>
        <Link href="/profile/edit-profile">
          <Button className="w-full" variant={"secondary"}>
            Payment Methods
          </Button>
        </Link>
        <Link href="/profile/create-event">
          <Button className="w-full" variant={"secondary"}>
            Host an Event
          </Button>
        </Link>
      </div>
    </main>
  );
}
