import Link from "next/link";
import { Button } from "../ui/button";
import { LucideArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LandingButton({
  href,
  variant = "default",
  text,
  className,
}: {
  href: string;
  variant?: "outline" | "default" | "tertiary" | "ghost";
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
          className={cn(
            "hidden md:block group-hover:text-foreground/80 group-hover:translate-x-[0.1rem] group-hover:-translate-y-[0.1rem] transition duration-300",
            variant === "outline"
              ? "dark:group-hover:text-foreground/80"
              : "dark:group-hover:text-background/80"
          )}
        />
        <LucideArrowUpRight
          size={20}
          className={cn(
            "block md:hidden group-hover:text-foreground/80 group-hover:translate-x-[0.1rem] group-hover:-translate-y-[0.1rem] transition duration-300",
            variant === "outline"
              ? "dark:group-hover:text-foreground/80"
              : "dark:group-hover:text-background/80"
          )}
        />
      </Link>
    </Button>
  );
}
