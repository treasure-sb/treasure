import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

type LabelInputProps = InputProps & {
  label: string;
  labelClassName?: string;
  inputClassName?: string;
};

export function InputWithLabel({
  label,
  labelClassName,
  inputClassName,
  ...props
}: LabelInputProps) {
  return (
    <div className="grid w-full items-center gap-1.5">
      <Label htmlFor={props.id} className={cn(labelClassName)}>
        {label}
      </Label>
      <Input className={cn(inputClassName)} {...props} />
    </div>
  );
}
