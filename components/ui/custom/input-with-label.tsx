import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { InputProps } from "@/components/ui/input";

type LabelInputProps = InputProps & {
  label: string;
  labelClassName?: string;
  inputClassName?: string;
};

export function InputWithLabel({
  label,
  labelClassName,
  inputClassName,
  error,
  ...props
}: LabelInputProps) {
  return (
    <div className="grid w-full items-center gap-2">
      <Label htmlFor={props.id} className={cn("text-[13px]", labelClassName)}>
        {label}
      </Label>
      <Input className={cn(inputClassName)} {...props} error={error} />
    </div>
  );
}
