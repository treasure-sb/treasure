import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center transition duration-300 justify-center whitespace-nowrap rounded-sm text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-foreground dark:text-primary-foreground hover:bg-primary/90 disabled:bg-primary/60",
        tertiary:
          "bg-tertiary text-foreground dark:text-primary-foreground hover:bg-tertiary/80 disabled:bg-tertiary/60",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/80 disabled:bg-destructive/30",
        outline:
          "border border-foreground bg-background hover:text-accent-foreground disabled:bg-background disabled:text-secondary-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:bg-secondary/60",
        dotted:
          "border-dotted border-[1px] rounded-sm hover:bg-accent hover:text-accent-foreground flex items-center space-x-2",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        accent: "bg-accent text-accent-foreground hover:bg-accent/90",
        link: "text-primary underline-offset-4 hover:underline",
        field:
          "bg-field border border-input hover:border-primary transition duration-300",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-sm px-3",
        lg: "h-11 rounded-sm px-8",
        icon: "h-10 w-10",
        landing: "w-auto px-4 py-2 2xl:text-lg 2xl:px-5 2xl:py-3 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
