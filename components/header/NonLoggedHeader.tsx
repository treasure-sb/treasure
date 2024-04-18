import Link from "next/link";
import Image from "next/image";
import HeaderMotion from "./HeaderMotion";

export default function NonLoggedHeader() {
  return (
    <HeaderMotion>
      <Link
        href="/"
        className="font-bold text-3xl flex items-center justify-start space-x-1"
      >
        <Image
          src="/static/web_logo.png"
          alt="web logo"
          width={150}
          height={100}
        />
      </Link>
      <div className="flex items-center space-x-4 md:space-x-8">
        <Link
          href="/events"
          className="hover:text-foreground/80 transition duration-300 text-lg font-semibold"
        >
          Events
        </Link>
        <Link
          href="/login"
          className="text-primary hover:text-primary/80 transition duration-300 text-lg font-semibold"
        >
          Login
        </Link>
      </div>
    </HeaderMotion>
  );
}
