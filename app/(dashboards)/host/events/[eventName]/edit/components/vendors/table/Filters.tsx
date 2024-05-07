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
  vendorTypeFilter,
  assignmentFilter,
  updateVendorTypeFilter,
  updateAssignmentFilter,
}: {
  vendorTypeFilter?: unknown;
  assignmentFilter?: unknown;
  updateVendorTypeFilter: (value: string | undefined) => void;
  updateAssignmentFilter: (value: string | undefined) => void;
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
            <h1>Vendor Type</h1>
            <div
              className={cn(
                "w-2 h-2 rounded-full ml-3 transition-all duration-300",
                vendorTypeFilter === "Verified"
                  ? "bg-primary"
                  : vendorTypeFilter === "Temporary"
                  ? "bg-destructive"
                  : "bg-secondary"
              )}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40 p-1 bg-background">
          <Command>
            <CommandGroup>
              <CommandItem onSelect={() => updateVendorTypeFilter("Verified")}>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    vendorTypeFilter === "PAID" ? "opacity-100" : "opacity-0"
                  )}
                />
                Verified
              </CommandItem>
              <CommandItem onSelect={() => updateVendorTypeFilter("Temporary")}>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    vendorTypeFilter === "UNPAID" ? "opacity-100" : "opacity-0"
                  )}
                />
                Temporary
              </CommandItem>
              {vendorTypeFilter ? (
                <>
                  <Separator className="my-2" />
                  <Button
                    onClick={() => updateVendorTypeFilter(undefined)}
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
            <h1>Assignment Status</h1>
            <div
              className={cn(
                "w-2 h-2 rounded-full ml-3 transition-all duration-300",
                assignmentFilter === "ASSIGNED"
                  ? "bg-primary"
                  : assignmentFilter === "N/A"
                  ? "bg-destructive"
                  : "bg-secondary"
              )}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40 p-1 bg-background mr-3">
          <Command>
            <CommandGroup>
              <CommandItem onSelect={() => updateAssignmentFilter("N/A")}>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    assignmentFilter === "N/A" ? "opacity-100" : "opacity-0"
                  )}
                />
                Unassigned
              </CommandItem>
              {assignmentFilter ? (
                <>
                  <Separator className="my-2" />
                  <Button
                    onClick={() => updateAssignmentFilter(undefined)}
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
      {vendorTypeFilter || assignmentFilter ? (
        <Button
          onClick={() => {
            updateAssignmentFilter(undefined);
            updateVendorTypeFilter(undefined);
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
