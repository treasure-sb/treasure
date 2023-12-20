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
        <header>
          <Link
            href="/"
            className="font-semibold text-3xl space-x-1 flex items-center justify-center mr-6"
          >
            <TreasureEmerald width={34} height={34} />
            <h1>Treasure</h1>
          </Link>
        </header>
      ) : (
        <header className="flex justify-between md:max-w-6xl xl:max-w-7xl m-auto w-full mb-10 items-center">
          <Link
            href="/"
            className="font-semibold text-3xl flex items-center space-x-1"
          >
            <TreasureEmerald width={34} height={34} />
            <h1>Treasure</h1>
          </Link>
          <Link href="/login">
            <Button
              variant={"outline"}
              className="w-20 lg:w-28 border-primary rounded-3xl"
            >
              Log in
            </Button>
          </Link>
        </header>
      )}
    </>
  );
}
