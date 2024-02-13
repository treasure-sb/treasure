"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import TreasureEmerald from "../icons/TreasureEmerald";

export default function Header() {
  const pathname = usePathname();

  return (
    <>
      {pathname === "/login" || pathname === "/signup" ? (
        <header className="z-50">
          <Link
            href="/"
            className="font-semibold text-3xl space-x-1 flex items-center justify-center mr-6"
          >
            <TreasureEmerald width={34} height={34} />
            <h1>Treasure</h1>
          </Link>
        </header>
      ) : (
        <header className="flex justify-between md:max-w-6xl xl:max-w-7xl m-auto w-full mb-10 items-center z-50">
          <Link
            href="/"
            className="font-semibold text-3xl flex items-center space-x-1 scale-90 -translate-x-4 sm:scale-100 sm:translate-x-0"
          >
            <TreasureEmerald width={34} height={34} />
            <h1>Treasure</h1>
          </Link>
          <div>
            <Link
              href="/events"
              className="my-auto font-semibold mr-6 text-lg relative group"
            >
              <span>Events</span>
            </Link>
            <Link href="/login">
              <Button
                variant={"outline"}
                className="w-20 lg:w-28 border-primary rounded-3xl"
              >
                Log in
              </Button>
            </Link>
          </div>
        </header>
      )}
    </>
  );
}
