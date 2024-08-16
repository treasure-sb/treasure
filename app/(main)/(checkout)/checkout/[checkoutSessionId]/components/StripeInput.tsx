import { Input } from "@/components/ui/input";
import { InputProps } from "@/components/ui/input";

export default function StripeInput(props: InputProps) {
  return (
    <Input
      className="shadow-[0px_2px_4px_rgba(0,0,0,0.5),0px_1px_6px_rgba(0,0,0,0.2)] border-[1px] rounded-[5px] p-3 bg-[#fafaf5] dark:bg-[#0c0a09] placeholder:text-[#808080] placeholder:text-sm border-[#f1f1e5] dark:border-[#28211e] focus-visible:border-primary/30"
      {...props}
    />
  );
}
