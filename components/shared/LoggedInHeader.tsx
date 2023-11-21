"use client";

import Link from "next/link";
export default function LoggedInHeader() {
  return (
    <header className="flex justify-between md:max-w-6xl xl:max-w-7xl m-auto w-full mb-10">
      <Link href="/" className="font-bold text-3xl">
        Treasure
      </Link>
      <Link href="/profile">
        <h1>My Profile</h1>
      </Link>
    </header>
  );
}
