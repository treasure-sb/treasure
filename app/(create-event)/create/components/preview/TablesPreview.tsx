import { Button } from "@/components/ui/button";
import { USDollar } from "@/lib/utils";
import { CreateEvent } from "../../schema";
import { useFormContext } from "react-hook-form";

export default function TablesPreview() {
  const { getValues } = useFormContext<CreateEvent>();
  const tables = getValues("tables");

  const minimumTablePrice = tables.reduce((acc, table) => {
    return Math.min(acc, parseFloat(table.price));
  }, Infinity);

  return (
    <div className="w-full items-center flex justify-between font-semibold space-x-4">
      <div className="flex flex-col sm:flex-row sm:gap-1">
        <p className="text-lg">Tables from</p>
        <p className="text-lg">{USDollar.format(minimumTablePrice)}</p>
      </div>
      <Button className="border-primary w-32 rounded-full">Register Now</Button>
    </div>
  );
}
