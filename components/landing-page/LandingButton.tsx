import Link from "next/link";
import { Button } from "../ui/button";
import { LucideArrowUpRight } from "lucide-react";

export default function LandingButton({
  href,
  variant = "default",
  text,
  className,
}: {
  href: string;
  variant?: "outline" | "default" | "tertiary";
  text: string;
  className?: string;
}) {
  return (
    <Button className={className} variant={variant} size={"landing"} asChild>
      <Link
        className="flex items-center space-x-1 group text-xs md:text-base"
        href={href}
      >
        <p>{text}</p>
        <LucideArrowUpRight
          size={26}
          className="hidden md:block group-hover:text-foreground/80 group-hover:translate-x-[0.1rem] group-hover:-translate-y-[0.1rem] transition duration-300"
        />
        <LucideArrowUpRight
          size={20}
          className="block md:hidden group-hover:text-foreground/80 group-hover:translate-x-[0.1rem] group-hover:-translate-y-[0.1rem] transition duration-300"
        />
      </Link>
    </Button>
  );
}
