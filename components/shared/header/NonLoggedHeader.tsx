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
        <Link
          href="/home"
          className="flex items-center justify-start space-x-1"
        >
          <div className="flex space-x-1 items-center font-bold">
            <TreasureEmerald width={16} height={16} />
            <p className="text-2xl">Treasure</p>
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
