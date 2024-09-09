import { Button } from "@/components/ui/button";
import { Edit2Icon, PlusIcon, Trash2Icon } from "lucide-react";
import TableIcon from "@/components/icons/TableIcon";
import CreateEventCard from "../../CreateEventCard";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useState } from "react";
import { USDollar } from "@/lib/utils";
import EventTablesSheet from "./EventTablesSheet";

const EventTicketDisplay = () => {
  return (
    <div className="p-4 bg-background rounded-sm font-semibold border hover:bg-secondary hover:cursor-pointer duration-300 transition relative group">
      <div className="flex">
        <TableIcon className="text-tertiary mr-4" />
        <p className="mr-2">GA</p>
        <p>$0.00</p>
      </div>
      <Edit2Icon
        size={16}
        className="absolute ml-auto top-2 right-2 text-muted-foreground group-hover:text-foreground duration-300 transition"
      />
    </div>
  );
};

export default function EventTables() {
  const [openSheet, setOpenSheet] = useState(false);
  const [editIndex, setEditIndex] = useState(0);
  const { control, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "tables",
  });

  const tables = watch("tables");

  const handleSelectTable = (index: number) => {
    setEditIndex(index);
    setOpenSheet(true);
  };

  const handleAppend = () => {
    append({
      name: "",
      description: "",
      price: "0.00",
      quantity: "100",
      spaceAllocated: "",
      numberVendorsAllowed: "",
      additionalInformation: "",
      tableProvided: false,
    });
  };

  const EventTablesFooter = (
    <div className="flex w-full justify-end space-x-2">
      <Button
        type="button"
        variant={"outline"}
        onClick={handleAppend}
        className="space-x-2 text-xs rounded-full"
      >
        <PlusIcon size={18} />
        <span>Add Another Table</span>
      </Button>
    </div>
  );

  return (
    <>
      <CreateEventCard title="Event Tables" footer={EventTablesFooter}>
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center space-x-2">
              <Button
                type="button"
                variant={"field"}
                onClick={() => handleSelectTable(index)}
                className="w-full p-4 py-6 bg-field font-semibold relative group"
              >
                <div className="flex mr-auto items-center">
                  <TableIcon className="text-tertiary mr-4" />

                  <p className="mr-2">
                    {tables[index].name === "" ? (
                      <span className="italic">Enter Table Name</span>
                    ) : (
                      tables[index].name
                    )}
                  </p>
                  <p>{USDollar.format(parseFloat(tables[index].price))}</p>
                </div>
                <Edit2Icon
                  size={16}
                  className="absolute ml-auto top-2 right-2 text-muted-foreground group-hover:text-foreground duration-300 transition"
                />
              </Button>
              <Trash2Icon
                size={16}
                className="text-muted-foreground ml-auto hover:text-destructive transition hover:cursor-pointer"
                onClick={() => remove(index)}
              />
            </div>
          ))}
        </div>
      </CreateEventCard>
      <EventTablesSheet
        openSheet={openSheet}
        setOpenSheet={setOpenSheet}
        index={editIndex}
      />
    </>
  );
}
