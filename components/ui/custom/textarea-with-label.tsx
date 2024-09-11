import * as React from "react";

import { Label } from "@/components/ui/label";
import { Textarea } from "../textarea";
import { TextareaProps } from "../textarea";
import { cn } from "@/lib/utils";

type LabelTextareaProps = TextareaProps & {
  label: string;
  labelClassName?: string;
  inputClassName?: string;
};

export function TextareaWithLabel({
  label,
  labelClassName,
  inputClassName,
  error,
  ...props
}: LabelTextareaProps) {
  return (
    <div className="grid w-full gap-2">
      <Label htmlFor={props.id} className={cn("text-[13px]", labelClassName)}>
        {label}
      </Label>
      <Textarea className={cn(inputClassName)} {...props} error={error} />
    </div>
  );
}
