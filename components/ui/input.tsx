import * as React from "react";

import { cn } from "@/lib/utils";
import { FieldError } from "react-hook-form";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: FieldError;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 bg-field w-full rounded-sm border border-input px-3 py-2 font-light placeholder:font-light text-[16px] ring-offset-background placeholder:text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition duration-300",
          className,
          error &&
            "border-destructive focus-visible:border-destructive focus-visible:ring-red-500 bg-red-100"
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
