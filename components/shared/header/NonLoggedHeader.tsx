import Link from "next/link";
import HeaderMotion from "./HeaderMotion";
import HeaderStatic from "./HeaderStatic";
import TreasureEmerald from "@/components/icons/TreasureEmerald";

export default function NonLoggedHeader({
  useMotion = true,
  isEventPage = false,
}: {
  useMotion?: boolean;
  isEventPage?: boolean;
}) {
  const Header = useMotion ? HeaderMotion : HeaderStatic;

  return (
    <Header>
      {!isEventPage && (
        <Link href="/home" className="flex items-center justify-start">
          <div className="flex -space-x-1 items-center font-bold">
            <TreasureEmerald
              className="block lg:hidden"
              width={16}
              height={16}
            />
            <TreasureEmerald
              className="hidden lg:block"
              width={22}
              height={22}
            />
            <p className="text-2xl lg:text-3xl tracking-[-0.1rem] lg:tracking-[-0.14rem]">
              Treasure
            </p>
          </div>
        </Link>
      )}
      <div className="flex items-center space-x-4 md:space-x-8 ml-auto">
        {!isEventPage && (
          <Link
            href="/events"
            className="hover:text-foreground/80 transition duration-300 text-lg font-semibold"
          >
            Events
          </Link>
        )}
        <Link
          href="/login"
          className="text-primary hover:text-primary/80 transition duration-300 text-lg font-semibold"
        >
          Login
        </Link>
      </div>
    </Header>
  );
}
