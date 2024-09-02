import * as React from "react";

import { Label } from "@/components/ui/label";
import { Textarea } from "../textarea";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

type LabelTextareaProps = TextareaProps & { label: string };

export function TextareaWithLabel({ label, ...props }: LabelTextareaProps) {
  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor={props.id}>{label}</Label>
      <Textarea {...props} />
    </div>
  );
}
