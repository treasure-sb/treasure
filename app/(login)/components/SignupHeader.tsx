import Link from "next/link";
import TreasureEmerald from "@/components/icons/TreasureEmerald";

export default function SignupHeader() {
  return (
    <header className="md:max-w-6xl xl:max-w-7xl m-auto w-full z-10">
      <Link
        href="/"
        className="font-semibold text-3xl space-x-1 flex items-center justify-center w-fit"
      >
        <TreasureEmerald width={24} height={24} />
        <p className="text-md">Treasure</p>
      </Link>
    </header>
  );
}
