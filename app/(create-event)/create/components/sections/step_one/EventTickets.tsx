import { Button } from "@/components/ui/button";
import { Edit2Icon, PlusIcon, Trash2Icon } from "lucide-react";
import { TicketIcon } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { CreateEvent } from "../../../schema";
import { USDollar, cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import CreateEventCard from "../../CreateEventCard";
import EventTicketsSheet from "./EventTicketsSheet";

export default function EventTickets() {
  const [openSheet, setOpenSheet] = useState(false);
  const [editIndex, setEditIndex] = useState(0);
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<CreateEvent>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "tickets",
  });

  const tickets = watch("tickets");

  const handleAppend = () => {
    append({
      name: "",
      description: "",
      price: "0.00",
      quantity: "100",
      dates: [],
    });
  };

  const handleSelectTicket = (index: number) => {
    setEditIndex(index);
    setOpenSheet(true);
  };

  const handleRemove = (index: number) => {
    if (fields.length === 1) {
      toast.error("You must have at least one ticket");
      return;
    }
    remove(index);
  };

  const EventTicketsFooter = (
    <div className="flex w-full justify-end space-x-2">
      <Button
        type="button"
        variant={"outline"}
        className="space-x-2 text-xs rounded-full"
        onClick={handleAppend}
      >
        <PlusIcon size={18} />
        <span>Add Another Ticket</span>
      </Button>
    </div>
  );

  return (
    <>
      <CreateEventCard title="Event Tickets" footer={EventTicketsFooter}>
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center space-x-2">
              <Button
                type="button"
                variant={"field"}
                onClick={() => handleSelectTicket(index)}
                className={cn(
                  "w-full p-4 py-6 bg-field font-semibold relative group",
                  errors?.tickets?.[index]?.name &&
                    "border border-destructive hover:border-destructive bg-red-100"
                )}
              >
                <div className="flex mr-auto items-center">
                  <TicketIcon
                    size={24}
                    className="text-tertiary mr-4 stroke-1"
                  />
                  <p className="mr-2">
                    {tickets[index].name === "" ? (
                      <span className="italic">Enter Ticket Name</span>
                    ) : (
                      tickets[index].name
                    )}
                  </p>
                  <p>{USDollar.format(parseFloat(tickets[index].price))}</p>
                </div>
                <Edit2Icon
                  size={16}
                  className="absolute ml-auto top-2 right-2 text-muted-foreground group-hover:text-foreground duration-300 transition"
                />
              </Button>
              <Trash2Icon
                size={16}
                className="text-muted-foreground ml-auto hover:text-destructive transition hover:cursor-pointer"
                onClick={() => handleRemove(index)}
              />
            </div>
          ))}
        </div>
      </CreateEventCard>
      <EventTicketsSheet
        openSheet={openSheet}
        setOpenSheet={setOpenSheet}
        index={editIndex}
      />
    </>
  );
}
