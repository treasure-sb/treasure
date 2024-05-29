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
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useFieldArray } from "react-hook-form";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { motion } from "framer-motion";
import { createTickets, updateTickets } from "@/lib/actions/tickets";
import { toast } from "sonner";

export const ticketSchema = z.object({
  db_id: z.string().optional(),
  price: z.string().refine(
    (num) => {
      return !isNaN(Number(num)) && Number(num) >= 0;
    },
    {
      message: "Must be a valid ticket price",
    }
  ),
  quantity: z.string().refine(
    (num) => {
      const number = Number(num);
      return !isNaN(number) && Number.isInteger(number) && number > 0;
    },
    {
      message: "Must be a valid ticket quantity",
    }
  ),
  name: z.string().min(1, {
    message: "Ticket name is required",
  }),
  status: z.enum(["added", "unchanged"]),
});

const formSchema = z.object({
  tickets: z.array(ticketSchema),
});

export default function EditTicketsForm({
  tickets,
  eventId,
  toggleEdit,
}: {
  tickets: Tables<"tickets">[];
  eventId: string;
  toggleEdit: () => void;
}) {
  const { refresh } = useRouter();
  const ticketFields: z.infer<typeof ticketSchema>[] = tickets.map(
    (ticket) => ({
      db_id: ticket.id,
      price: ticket.price.toFixed(2),
      quantity: ticket.quantity.toString(),
      name: ticket.name,
      status: "unchanged" as const,
    })
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tickets: ticketFields,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tickets",
  });

  const addTicket = () => {
    append({
      price: "",
      quantity: "",
      name: "",
      status: "added",
    });
  };

  const removeTicket = (index: number) => {
    remove(index);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    toast.loading("Updating tickets...");
    const { tickets: formTickets } = values;

    const addedTickets = formTickets
      .filter((ticket) => ticket.status === "added")
      .map((ticket) => ({
        price: ticket.price,
        quantity: ticket.quantity,
        name: ticket.name,
        event_id: eventId,
      }));

    const updatedTickets = formTickets
      .filter((ticket) => {
        const originalTicket = tickets.find(
          (origTicket) => origTicket.id.toString() === ticket.db_id
        );
        return (
          originalTicket &&
          (ticket.name !== originalTicket.name ||
            Number(ticket.price) !== originalTicket.price ||
            Number(ticket.quantity) !== originalTicket.quantity)
        );
      })
      .map((ticket) => ({
        price: ticket.price,
        quantity: ticket.quantity,
        name: ticket.name,
        id: ticket.db_id,
      }));

    const [createResult, updateResult] = await Promise.allSettled([
      createTickets(addedTickets),
      updateTickets(updatedTickets),
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
      toast.error("Error updating tickets, please try again");
      return;
    }

    toast.success("Tickets updated!");
    toggleEdit();
    refresh();
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
          <div key={field.id} className="flex justify-between space-x-4">
            <FormField
              control={form.control}
              name={`tickets.${index}.name`}
              render={({ field }) => (
                <FormItem>
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
              name={`tickets.${index}.price`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingLabelInput
                      label="Price"
                      {...field}
                      value={`$${field.value}`}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.]/g, "");
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
              name={`tickets.${index}.quantity`}
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
            {!field.db_id && (
              <Button
                type="button"
                variant={"ghost"}
                onClick={() => removeTicket(index)}
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
            onClick={addTicket}
            className="text-white"
          >
            + Add Ticket
          </Button>
        </div>
      </motion.form>
    </Form>
  );
}
