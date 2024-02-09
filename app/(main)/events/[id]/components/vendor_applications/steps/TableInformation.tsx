import { Button } from "@/components/ui/button";
import { useVendorApplicationStore } from "../store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Tables } from "@/types/supabase";

export default function TableInformation({
  table,
  tables,
  prebooked,
}: {
  table: Tables<"tables">;
  tables: Tables<"tables">[];
  prebooked: boolean;
}) {
  const {
    currentStep,
    tableQuantity,
    vendorsAtTable,
    tableNumber,
    setCurrentStep,
    setTableQuantity,
    setVendorsAtTable,
    setTableNumber,
  } = useVendorApplicationStore();

  const numberVendorsOptions = Array.from({
    length: table.number_vendors_allowed,
  }).map((_, i) => (
    <SelectItem key={i} value={`${i + 1}`}>
      {i + 1}
    </SelectItem>
  ));

  const tablesOptions = tables.map((table, i) => (
    <SelectItem key={i} value={`${i}`}>
      {table.section_name}
    </SelectItem>
  ));

  return (
    <>
      <div className="flex flex-col justify-between h-[80%]">
        <div className="space-y-6">
          <h1 className="text-xl font-semibold">Table Information</h1>
          <div className="flex items-center justify-between">
            <p>Table Section</p>
            {prebooked ? (
              <Select
                value={tableNumber > -1 ? tableNumber.toString() : undefined}
                onValueChange={(value) => setTableNumber(parseInt(value))}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>{tablesOptions}</SelectContent>
              </Select>
            ) : (
              <p>{table.section_name}</p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <p>Table Quantity</p>
            <Select
              value={tableQuantity > 0 ? tableQuantity.toString() : undefined}
              onValueChange={(value) => setTableQuantity(parseInt(value))}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="6">6</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <p>Vendors at Table</p>
            <Select
              value={vendorsAtTable > 0 ? vendorsAtTable.toString() : undefined}
              onValueChange={(value) => setVendorsAtTable(parseInt(value))}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>{numberVendorsOptions}</SelectContent>
            </Select>
          </div>
          <p className="text-gray-400">
            Only {table.number_vendors_allowed} vendors allowed per table.
          </p>
        </div>
        {vendorsAtTable > 0 && tableQuantity > 0 && !prebooked && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                duration: 1.5,
                type: "spring",
              },
            }}
          >
            <div className="flex justify-between">
              <p>{table.section_name}</p>
              <p>Qty: {tableQuantity}</p>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-end">
              ${table.price * tableQuantity}
            </div>
          </motion.div>
        )}
      </div>
      <div className="flex space-x-2">
        <Button
          onClick={() => setCurrentStep(currentStep - 1)}
          className="w-full"
          variant={"secondary"}
        >
          Back
        </Button>
        <Button
          onClick={() => setCurrentStep(currentStep + 1)}
          className={`${
            vendorsAtTable > 0 && tableQuantity > 0
              ? "bg-primary cursor-pointer"
              : "bg-primary/40 pointer-events-none"
          } w-full`}
        >
          Continue
        </Button>
      </div>
    </>
  );
}
