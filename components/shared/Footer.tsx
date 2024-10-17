import TreasureEmerald from "@/components/icons/TreasureEmerald";
import Image from "next/image";
import InstagramIcon from "../icons/applications/InstagramIcon";
import Link from "next/link";
import { Instagram } from "lucide-react";

interface NavigationItem {
  name: string;
  href: string;
}

const navigation: {
  main: NavigationItem[];
} = {
  main: [
    { name: "Events", href: "/events" },
    {
      name: "Contact",
      href: "https://app.formbricks.com/s/cls9piboz4960sted3d1snwj2",
    },
    { name: "Pricing", href: "/pricing" },
    { name: "Privacy", href: "/privacy" },
    { name: "Terms of Use", href: "/terms" },
  ],
};

export default function Footer({
  isEventPage = false,
}: {
  isEventPage?: boolean;
}) {
  const filteredNavigation = isEventPage
    ? navigation.main.filter((item) => item.name !== "Events")
    : navigation.main;

  return (
    <footer className="w-full">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-2">
        <nav className="flex flex-wrap justify-center md:space-x-2">
          {filteredNavigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="px-2 py-1 text-sm text-gray-600 dark:text-gray-100"
            >
              {item.name}
            </a>
          ))}
        </nav>
        <Link
          href="/home"
          className="flex items-center justify-center font-bold -space-x-1"
        >
          <TreasureEmerald width={8} height={8} />
          <p className="tracking-tighter">Treasure</p>
        </Link>
        <Link
          className="flex items-center justify-center"
          href={"https://www.instagram.com/treasure_hq/"}
          target="_blank"
        >
          <Instagram />
        </Link>

        <p className="text-center text-sm text-gray-600 dark:text-gray-100 px-2 py-1">
          &copy; {new Date().getFullYear()} Treasure. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
