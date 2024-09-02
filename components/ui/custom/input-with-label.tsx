import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

type LabelInputProps = InputProps & { label: string };

export function InputWithLabel({ label, ...props }: LabelInputProps) {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor={props.id}>{label}</Label>
      <Input {...props} />
    </div>
  );
}
