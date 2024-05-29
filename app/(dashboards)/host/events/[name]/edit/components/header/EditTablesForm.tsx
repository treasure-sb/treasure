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
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { FormTable, createTables, updateTables } from "@/lib/actions/tables";

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
  space_allocated: z.string().refine(
    (num) => {
      const number = Number(num);
      return !isNaN(number) && Number.isInteger(number) && number > 0;
    },
    {
      message: "Must be a valid integer",
    }
  ),
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
  const tableFields: z.infer<typeof tableSchema>[] = tables.map((table) => ({
    db_id: table.id,
    price: table.price.toFixed(2),
    quantity: table.quantity.toString(),
    section_name: table.section_name,
    table_provided: table.table_provided,
    space_allocated: table.space_allocated.toString(),
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
      space_allocated: "",
      status: "added",
    });
  };

  const removeTable = (index: number) => {
    remove(index);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    toast.loading("Updating tables...");
    const { tables: formTables } = values;

    const addedTables: FormTable[] = formTables
      .filter((table) => table.status === "added")
      .map((table) => ({
        price: table.price,
        quantity: table.quantity,
        section_name: table.section_name,
        event_id: eventId,
        space_allocated: table.space_allocated,
        table_provided: table.table_provided,
      }));

    const updatedTables: FormTable[] = formTables
      .filter((table) => {
        const originalTable = tables.find(
          (origTable) => origTable.id.toString() === table.db_id
        );
        return (
          originalTable &&
          (table.section_name !== originalTable.section_name ||
            Number(table.price) !== originalTable.price ||
            Number(table.quantity) !== originalTable.quantity ||
            Number(table.space_allocated) !== originalTable.space_allocated ||
            table.table_provided !== originalTable.table_provided)
        );
      })
      .map((table) => ({
        price: table.price,
        quantity: table.quantity,
        section_name: table.section_name,
        table_provided: table.table_provided,
        event_id: eventId,
        space_allocated: table.space_allocated,
        id: table.db_id,
      }));

    const [createResult, updateResult] = await Promise.allSettled([
      createTables(addedTables),
      updateTables(updatedTables),
    ]);

    toast.dismiss();

    const createError =
      createResult.status === "rejected"
        ? createResult.reason
        : createResult.value.error;
    const updateError =
      updateResult.status === "rejected"
        ? updateResult.reason
        : updateResult.value.error;

    if (createError || updateError) {
      toast.error("Error updating tables, please try again");
      return;
    }

    toast.success("Tables updated!");
    toggleEdit();
    refresh();
  };

  const MotionButton = motion(Button);

  return (
    <Form {...form}>
      <motion.form onSubmit={form.handleSubmit(onSubmit)} layout="position">
        <div className="items-center flex justify-between space-x-4 mb-4">
          <motion.p className="text-lg font-semibold" layout="position">
            Table Edit
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
        <div className="space-y-10">
          {fields.map((field, index) => (
            <div className="flex">
              <div key={field.id} className="grid grid-cols-3">
                <FormField
                  control={form.control}
                  name={`tables.${index}.section_name`}
                  render={({ field }) => (
                    <FormItem className="row-span-2">
                      <FormControl>
                        <FloatingLabelInput
                          label="Name"
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
                          value={`$${field.value}`}
                          onChange={(e) => {
                            const value = e.target.value.replace(
                              /[^0-9.]/g,
                              ""
                            );
                            field.onChange(value);
                          }}
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
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <div className="leading-none">
                        <FormLabel className="text-xs text-gray-500">
                          Table Provided
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Checkbox
                          className="h-4 w-4 border-foreground/20 data-[state=checked]:bg-foreground data-[state=checked]:text-background"
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
                <FormField
                  control={form.control}
                  name={`tables.${index}.space_allocated`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FloatingLabelInput
                          label="Space Allocated"
                          {...field}
                          value={`${field.value}ft`}
                          onChange={(e) => {
                            const value = e.target.value.replace(
                              /[^0-9.]/g,
                              ""
                            );
                            field.onChange(value);
                          }}
                          className="border-none"
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
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            variant={"link"}
            onClick={addTable}
            className="text-white"
          >
            + Add Table
          </Button>
        </div>
      </motion.form>
    </Form>
  );
}
