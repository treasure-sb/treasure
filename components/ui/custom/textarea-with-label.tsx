import * as React from "react";

import { Label } from "@/components/ui/label";
import { Textarea } from "../textarea";
import { TextareaProps } from "../textarea";

type LabelTextareaProps = TextareaProps & { label: string };

export function TextareaWithLabel({
  label,
  error,
  ...props
}: LabelTextareaProps) {
  return (
    <div className="grid w-full gap-2">
      <Label htmlFor={props.id} className="text-[13px]">
        {label}
      </Label>
      <Textarea {...props} error={error} />
    </div>
  );
}
