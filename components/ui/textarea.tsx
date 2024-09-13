import * as React from "react";

import { cn } from "@/lib/utils";
import { FieldError } from "react-hook-form";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: FieldError;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }: TextareaProps, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input font-light placeholder:font-light bg-[#fafaf5] dark:bg-[#0c0a09] px-3 py-2 text-[16px] ring-offset-background placeholder:text-muted-foreground placeholder:text-sm focus-visible:outline-none focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition duration-300",
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
Textarea.displayName = "Textarea";

export { Textarea };
