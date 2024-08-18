import Link from "next/link";
import Logo from "@/components/icons/TreasureLogo";
import TreasureEmerald from "@/components/icons/TreasureEmerald";

export default function SignupHeader() {
  return (
    <header className="md:max-w-6xl xl:max-w-7xl m-auto w-full z-20">
      <Link href="/home" className="flex items-center justify-start">
        <div className="flex space-x-1 items-center font-bold">
          <TreasureEmerald width={16} height={16} />
          <p className="text-2xl">Treasure</p>
        </div>
      </Link>
    </header>
  );
}
