import Link from "next/link";
import Logo from "@/components/icons/TreasureLogo";
import TreasureEmerald from "@/components/icons/TreasureEmerald";

export default function SignupHeader() {
  return (
    <header className="md:max-w-6xl xl:max-w-7xl m-auto w-full z-20">
      <Link
        href="/home"
        className="flex items-center justify-start -space-x-1 font-bold"
      >
        <TreasureEmerald className="block lg:hidden" width={16} height={16} />
        <TreasureEmerald className="hidden lg:block" width={22} height={22} />
        <p className="text-2xl lg:text-3xl tracking-[-0.1rem] lg:tracking-[-0.14rem]">
          Treasure
        </p>
      </Link>
    </header>
  );
}
