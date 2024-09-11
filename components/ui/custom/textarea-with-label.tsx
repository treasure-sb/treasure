import * as React from "react";

import { Label } from "@/components/ui/label";
import { Textarea } from "../textarea";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

type LabelTextareaProps = TextareaProps & {
  label: string;
  labelClassName?: string;
  inputClassName?: string;
};

export function TextareaWithLabel({
  label,
  labelClassName,
  inputClassName,
  ...props
}: LabelTextareaProps) {
  return (
    <div className="grid w-full gap-2">
      <Label htmlFor={props.id} className="text-[13px]">
        {label}
      </Label>
      <Textarea className={cn(inputClassName)} {...props} />
    </div>
  );
}
