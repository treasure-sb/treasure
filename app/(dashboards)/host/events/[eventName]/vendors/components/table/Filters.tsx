import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function Filters({
  paymentFilter,
  applicationFilter,
  updateApplicationFilter,
  updatePaymentFilter,
}: {
  paymentFilter?: unknown;
  applicationFilter?: unknown;
  updateApplicationFilter: (value: string | undefined) => void;
  updatePaymentFilter: (value: string | undefined) => void;
}) {
  return (
    <div className="flex space-x-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"ghost"}
            role="combobox"
            className="border-dotted border-[1px] rounded-sm flex items-center"
          >
            <h1>Payment Status</h1>
            <div
              className={cn(
                "w-2 h-2 rounded-full ml-3 transition-all duration-300",
                paymentFilter === "PAID"
                  ? "bg-primary"
                  : paymentFilter === "UNPAID"
                  ? "bg-destructive"
                  : "bg-secondary"
              )}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40 p-1 bg-background">
          <Command>
            <CommandGroup>
              <CommandItem onSelect={() => updatePaymentFilter("PAID")}>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    paymentFilter === "PAID" ? "opacity-100" : "opacity-0"
                  )}
                />
                Paid
              </CommandItem>
              <CommandItem onSelect={() => updatePaymentFilter("UNPAID")}>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    paymentFilter === "UNPAID" ? "opacity-100" : "opacity-0"
                  )}
                />
                Unpaid
              </CommandItem>
              {paymentFilter ? (
                <>
                  <Separator className="my-2" />
                  <Button
                    onClick={() => updatePaymentFilter(undefined)}
                    variant={"ghost"}
                    className="w-full rounded-sm"
                  >
                    Clear Filter
                  </Button>
                </>
              ) : null}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"ghost"}
            role="combobox"
            className="border-dotted border-[1px] rounded-sm flex items-center"
          >
            <h1>Application Status</h1>
            <div
              className={cn(
                "w-2 h-2 rounded-full ml-3 transition-all duration-300",
                applicationFilter === "ACCEPTED"
                  ? "bg-primary"
                  : applicationFilter === "REJECTED"
                  ? "bg-destructive"
                  : applicationFilter === "PENDING"
                  ? "bg-tertiary"
                  : "bg-secondary"
              )}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40 p-1 bg-background mr-3">
          <Command>
            <CommandGroup>
              <CommandItem onSelect={() => updateApplicationFilter("ACCEPTED")}>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    applicationFilter === "ACCEPTED"
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                Accepted
              </CommandItem>
              <CommandItem onSelect={() => updateApplicationFilter("REJECTED")}>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    applicationFilter === "REJECTED"
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                Rejected
              </CommandItem>
              <CommandItem onSelect={() => updateApplicationFilter("PENDING")}>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",

                    applicationFilter === "PENDING"
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                Pending
              </CommandItem>
              {applicationFilter ? (
                <>
                  <Separator className="my-2" />
                  <Button
                    onClick={() => updateApplicationFilter(undefined)}
                    variant={"ghost"}
                    className="w-full rounded-sm"
                  >
                    Clear Filter
                  </Button>
                </>
              ) : null}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      {applicationFilter || paymentFilter ? (
        <Button
          onClick={() => {
            updateApplicationFilter(undefined);
            updatePaymentFilter(undefined);
          }}
          className="rounded-sm"
          variant={"secondary"}
        >
          Reset
        </Button>
      ) : null}
    </div>
  );
}
