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
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { FormTable, createTables, updateTables } from "@/lib/actions/tables";
import { InputWithLabel } from "@/components/ui/custom/input-with-label";
import { LiveTable } from "@/types/tables";

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
      message: "Must be a valid number of tables for sale",
    }
  ),
  total_tables: z.string().refine(
    (num) => {
      const number = Number(num);
      return !isNaN(number) && Number.isInteger(number) && number > 0;
    },
    {
      message: "Must be a valid number of total tables available",
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
  tables: LiveTable[];
  eventId: string;
  toggleEdit: () => void;
}) {
  const { refresh } = useRouter();
  const tableFields: z.infer<typeof tableSchema>[] = tables.map((table) => ({
    db_id: table.id,
    price: table.price.toFixed(2),
    quantity: table.quantity.toString(),
    total_tables: table.total_tables.toString(),
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
      total_tables: "",
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
        total_tables: table.total_tables,
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
            Number(table.total_tables) !== originalTable.total_tables ||
            Number(table.space_allocated) !== originalTable.space_allocated ||
            table.table_provided !== originalTable.table_provided)
        );
      })
      .map((table) => ({
        price: table.price,
        quantity: table.quantity,
        total_tables: table.total_tables,
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
            <div>
              <div className="flex items-center mb-4">
                <p className="font-semibold text-sm">Table Tier {index + 1}</p>
                {!field.db_id && (
                  <Button
                    type="button"
                    variant={"link"}
                    onClick={() => removeTable(index)}
                    className="text-red-400 hover:text-destructive duration-300 transition hover:bg-transparent"
                  >
                    Remove
                  </Button>
                )}
              </div>
              <div className="flex items-center">
                <div key={field.id} className="grid grid-cols-3 gap-3">
                  <FormField
                    control={form.control}
                    name={`tables.${index}.section_name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <InputWithLabel
                            label="Name"
                            labelClassName="text-xs text-muted-foreground"
                            {...field}
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
                          <InputWithLabel
                            label="Price"
                            labelClassName="text-xs text-muted-foreground"
                            {...field}
                            value={`$${field.value}`}
                            onChange={(e) => {
                              const value = e.target.value.replace(
                                /[^0-9.]/g,
                                ""
                              );
                              field.onChange(value);
                            }}
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
                          <div className="relative hover:cursor-text w-full">
                            <InputWithLabel
                              label="Space Allocated"
                              labelClassName="text-xs text-muted-foreground"
                              {...field}
                              value={`${field.value}ft`}
                              onChange={(e) => {
                                const value = e.target.value.replace(
                                  /[^0-9.]/g,
                                  ""
                                );
                                field.onChange(value);
                              }}
                            />
                          </div>
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
                          <InputWithLabel
                            label="Total Tables For Sale"
                            labelClassName="text-xs text-muted-foreground"
                            {...field}
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
                    name={`tables.${index}.total_tables`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <InputWithLabel
                            label="Total Tables Available"
                            labelClassName="text-xs text-muted-foreground"
                            {...field}
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
                      <FormItem className="flex flex-row items-center md:space-x-2 space-x-1 space-y-0">
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
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            variant={"link"}
            onClick={addTable}
            className="text-foreground"
          >
            + Add Table
          </Button>
        </div>
      </motion.form>
    </Form>
  );
}
