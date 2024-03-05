"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import TreasureEmerald from "../../icons/TreasureEmerald";

export default function Header() {
  const pathname = usePathname();

  return (
    <>
      <header className="flex justify-between items-center md:max-w-6xl xl:max-w-7xl m-auto w-full mb-10 z-10">
        <Link
          href="/"
          className="font-semibold text-3xl flex items-center space-x-1"
        >
          <TreasureEmerald width={34} height={34} />
          <h1>Treasure</h1>
        </Link>
        <div className="flex items-center space-x-4 md:space-x-8">
          <Link
            href="/events"
            className="hover:text-foreground/80 transition duration-300 text-lg font-semibold"
          >
            Events
          </Link>
          <Link
            href="/login"
            className="text-primary hover:text-primary/80 transition duration-300 text-lg font-semibold"
          >
            Login
          </Link>
        </div>
      </header>
    </>
  );
}
