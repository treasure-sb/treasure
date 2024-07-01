import Link from "next/link";
import Logo from "@/components/icons/Logo";

export default function SignupHeader() {
  return (
    <header className="md:max-w-6xl xl:max-w-7xl m-auto w-full z-20">
      <Link
        href="/home"
        className="font-bold text-3xl flex items-center justify-start space-x-1"
      >
        <Logo />
      </Link>
    </header>
  );
}
