import { Tables } from "@/types/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useFieldArray } from "react-hook-form";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { motion } from "framer-motion";
import { createTickets, updateTickets } from "@/lib/actions/tickets";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

export const tableSchema = z.object({
  db_id: z.string().optional(),
  price: z.string().refine(
    (num) => {
      return !isNaN(Number(num)) && Number(num) >= 0;
    },
    {
      message: "Must be a valid table price",
    }
  ),
  quantity: z.string().refine(
    (num) => {
      const number = Number(num);
      return !isNaN(number) && Number.isInteger(number) && number > 0;
    },
    {
      message: "Must be a valid table quantity",
    }
  ),
  section_name: z.string().min(1, {
    message: "Table name is required",
  }),
  table_provided: z.boolean().default(false),
  status: z.enum(["added", "unchanged"]),
});

const formSchema = z.object({
  tables: z.array(tableSchema),
});

export default function EditTablesForm({
  tables,
  eventId,
  toggleEdit,
}: {
  tables: Tables<"tables">[];
  eventId: string;
  toggleEdit: () => void;
}) {
  const { refresh } = useRouter();
  const tableFields = tables.map((table) => ({
    db_id: table.id,
    price: table.price.toFixed(2),
    quantity: table.quantity.toString(),
    section_name: table.section_name,
    table_provided: table.table_provided,
    status: "unchanged" as const,
  }));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tables: tableFields,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tables",
  });

  const addTable = () => {
    append({
      price: "",
      quantity: "",
      section_name: "",
      table_provided: false,
      status: "added",
    });
  };

  const removeTable = (index: number) => {
    remove(index);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    toast.loading("Updating tickets...");
    const { tables: formTables } = values;

    const addedTables = formTables
      .filter((table) => table.status === "added")
      .map((table) => ({
        price: table.price,
        quantity: table.quantity,
        section_name: table.section_name,
        event_id: eventId,
      }));

    const updatedTickets = formTables
      .filter((table) => {
        const originalTable = tables.find(
          (origTable) => origTable.id.toString() === table.db_id
        );
        return (
          originalTable &&
          (table.section_name !== originalTable.section_name ||
            Number(table.price) !== originalTable.price ||
            Number(table.quantity) !== originalTable.quantity)
        );
      })
      .map((ticket) => ({
        price: ticket.price,
        quantity: ticket.quantity,
        name: ticket.section_name,
        id: ticket.db_id,
      }));

    // const [createResult, updateResult] = await Promise.allSettled([
    //   createTickets(addedTables),
    //   updateTickets(updatedTickets),
    // ]);

    // toast.dismiss();

    // if (
    //   createResult.status === "rejected" ||
    //   updateResult.status === "rejected"
    // ) {
    //   toast.error("Error updating tickets, please try again");
    //   return;
    // }

    // toast.success("Tickets updated!");
    // toggleEdit();
    // refresh();
  };

  const MotionButton = motion(Button);

  return (
    <Form {...form}>
      <motion.form onSubmit={form.handleSubmit(onSubmit)} layout="position">
        <div className="items-center flex justify-between space-x-4 mb-4">
          <motion.p className="text-lg font-semibold" layout="position">
            Ticket Edit
          </motion.p>
          <div className="space-x-2">
            <MotionButton
              layout="position"
              className="w-16"
              variant={"ghost"}
              onClick={toggleEdit}
            >
              Back
            </MotionButton>
            <MotionButton layout="position" className="w-24" type="submit">
              Confirm
            </MotionButton>
          </div>
        </div>
        {fields.map((field, index) => (
          <div>
            <div key={field.id} className="grid grid-cols-3">
              <FormField
                control={form.control}
                name={`tables.${index}.section_name`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FloatingLabelInput
                        label="Section Name"
                        {...field}
                        className="border-none"
                      />
                    </FormControl>
                    <div className="h-1">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`tables.${index}.price`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FloatingLabelInput
                        label="Price"
                        {...field}
                        className="border-none"
                      />
                    </FormControl>
                    <div className="h-1">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`tables.${index}.quantity`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FloatingLabelInput
                        label="Quantity"
                        {...field}
                        className="border-none"
                      />
                    </FormControl>
                    <div className="h-1">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`tables.${index}.table_provided`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Table Provided:</FormLabel>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="h-1">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {!field.db_id && (
              <Button
                type="button"
                variant={"ghost"}
                onClick={() => removeTable(index)}
                className="text-red-500 hover:text-destructive duration-300 transition hover:bg-transparent"
              >
                x
              </Button>
            )}
          </div>
        ))}
        <div className="flex justify-end">
          <Button
            type="button"
            variant={"link"}
            onClick={addTable}
            className="text-white"
          >
            Add Table
          </Button>
        </div>
      </motion.form>
    </Form>
  );
}
