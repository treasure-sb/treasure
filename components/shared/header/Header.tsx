"use client";
import Link from "next/link";
import TreasureEmerald from "../../icons/TreasureEmerald";

export default function Header() {
  return (
    <header className="flex h-12 justify-between items-center max-w-[var(--container-width)] m-auto w-full mb-10 z-10">
      <Link href="/" className="font-bold text-2xl flex items-center space-x-1">
        <TreasureEmerald width={28} height={28} />
        <p>Treasure</p>
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
  );
}
