"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store";

export default function Header() {
  const pathname = usePathname();
  const { isLoggedIn } = useAuthStore();

  return (
    <>
      {pathname === "/account" ? (
        <header className="text-center">
          <Link href="/" className="font-bold text-3xl">
            Treasure
          </Link>
        </header>
      ) : (
        <header className="flex justify-between md:max-w-6xl xl:max-w-[90rem] m-auto w-full mb-10">
          <Link href="/" className="font-bold text-3xl">
            Treasure
          </Link>
          {isLoggedIn ? (
            <Link href="/profile">My Profile</Link>
          ) : (
            <Link href="/account">
              <Button
                variant={"outline"}
                className="w-20 lg:w-28 border-primary"
              >
                Log in
              </Button>
            </Link>
          )}
        </header>
      )}
    </>
  );
}
