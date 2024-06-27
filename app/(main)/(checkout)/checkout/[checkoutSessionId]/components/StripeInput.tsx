import { Input } from "@/components/ui/input";
import { InputProps } from "@/components/ui/input";

export default function StripeInput(props: InputProps) {
  return (
    <Input
      className="border-[1px] rounded-[5px] p-2 bg-[#0c0a09] placeholder:text-[#808080] placeholder:text-sm border-[#28211e] focus-visible:border-primary/30"
      {...props}
    />
  );
}
