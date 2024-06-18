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
import { Checkbox } from "@/components/ui/checkbox";

export default function Filters({
  paymentFilter,
  applicationFilter,
  tagFilter,
  updateApplicationFilter,
  updatePaymentFilter,
  updateTagFilter,
  resetTagFilter,
  tags,
}: {
  paymentFilter?: unknown;
  applicationFilter?: unknown;
  tagFilter?: string[];
  updateApplicationFilter: (value: string | undefined) => void;
  updatePaymentFilter: (value: string | undefined) => void;
  updateTagFilter: (value: string) => void;
  resetTagFilter: () => void;
  tags: string[];
}) {
  return (
    <div className="flex space-x-2 overflow-scroll scrollbar-hidden">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"ghost"}
            role="combobox"
            className="border-dotted border-[1px] rounded-sm flex items-center"
          >
            <p>Payment Status</p>
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
        <PopoverContent align="start" className="w-40 p-1 bg-background">
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
            <p>Application Status</p>
            <div
              className={cn(
                "w-2 h-2 rounded-full ml-3 transition-all duration-300",
                applicationFilter === "ACCEPTED"
                  ? "bg-primary"
                  : applicationFilter === "REJECTED"
                  ? "bg-destructive"
                  : applicationFilter === "PENDING"
                  ? "bg-tertiary"
                  : applicationFilter === "WAITLISTED"
                  ? "bg-orange-500"
                  : "bg-secondary"
              )}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-40 p-1 bg-background">
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
              <CommandItem
                onSelect={() => updateApplicationFilter("WAITLISTED")}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",

                    applicationFilter === "WAITLISTED"
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                Waitlited
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
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"ghost"}
            role="combobox"
            className="border-dotted border-[1px] rounded-sm flex items-center"
          >
            <p>Tags</p>
            {tagFilter && tagFilter.length > 0 ? (
              <div className="ml-2 flex space-x-1 border-l-[1px] pl-2">
                {tagFilter.length < 4 ? (
                  tagFilter.map((tag) => (
                    <div
                      key={tag}
                      className="bg-secondary rounded-sm px-2 text-sm"
                    >
                      {tag}
                    </div>
                  ))
                ) : (
                  <div className="bg-secondary rounded-sm px-2 text-sm">
                    {tagFilter.length} selected
                  </div>
                )}
              </div>
            ) : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="p-1 bg-background w-40">
          <Command>
            <CommandGroup>
              {tags.map((tag) => (
                <CommandItem
                  key={tag}
                  onSelect={() => {
                    updateTagFilter(tag);
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={tagFilter?.includes(tag)}
                      className="border-muted-foreground data-[state=checked]:bg-foreground data-[state=checked]:text-background"
                      id={tag}
                    />
                    <p>{tag}</p>
                  </div>
                </CommandItem>
              ))}
              {tagFilter && tagFilter.length > 0 ? (
                <>
                  <Separator className="my-2" />
                  <Button
                    onClick={() => resetTagFilter()}
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
      {applicationFilter ||
      paymentFilter ||
      (tagFilter && tagFilter.length > 0) ? (
        <Button
          onClick={() => {
            updateApplicationFilter(undefined);
            updatePaymentFilter(undefined);
            resetTagFilter();
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
