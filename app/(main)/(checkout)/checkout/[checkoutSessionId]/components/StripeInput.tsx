import { Input } from "@/components/ui/input";
import { InputProps } from "@/components/ui/input";

export default function StripeInput(props: InputProps) {
  return (
    <Input
      className="border-[1px] rounded-sm p-2 bg-black placeholder:text-[#808080] placeholder:text-sm border-[#28211e] focus-visible:border-primary/30"
      {...props}
    />
  );
}
