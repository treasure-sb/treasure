import * as React from "react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

type LabelInputProps = InputProps & { label: string };

export function InputWithLabel({
  id,
  label,
  type,
  placeholder,
}: LabelInputProps) {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input type={type} id={id} placeholder={placeholder} />
    </div>
  );
}
