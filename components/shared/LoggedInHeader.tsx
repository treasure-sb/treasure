"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function LoggedInHeader() {
  return (
    <header className="flex justify-between md:max-w-6xl xl:max-w-[90rem] m-auto w-full mb-10">
      <Link href="/" className="font-bold text-3xl">
        Treasure
      </Link>
      <Link href="/profile">
        <h1>My Profile</h1>
      </Link>
    </header>
  );
}
