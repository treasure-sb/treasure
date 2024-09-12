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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useFieldArray } from "react-hook-form";
import { motion } from "framer-motion";
import { createTickets, updateTickets } from "@/lib/actions/tickets";
import { toast } from "sonner";
import { InputWithLabel } from "@/components/ui/custom/input-with-label";
import { TicketDetails } from "../EditEventDetails";
import { Check, ChevronsUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { TextareaWithLabel } from "@/components/ui/custom/textarea-with-label";
import { create } from "domain";

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
  total_tickets: z
    .string()
    .refine((num) => {
      const number = Number(num);
      return !isNaN(number) && Number.isInteger(number) && number > 0;
    })
    .optional(),
  ticket_dates: z.array(z.string()).min(1, {
    message: "Ticket date is required",
  }),
  name: z.string().min(1, {
    message: "Ticket name is required",
  }),
  description: z.string(),
  status: z.enum(["added", "unchanged"]),
});

const formSchema = z.object({
  tickets: z.array(ticketSchema),
});

export default function EditTicketsForm({
  tickets,
  eventDates,
  eventId,
  toggleEdit,
}: {
  tickets: TicketDetails[];
  eventDates: Tables<"event_dates">[];
  eventId: string;
  toggleEdit: () => void;
}) {
  const { refresh } = useRouter();
  const ticketFields: z.infer<typeof ticketSchema>[] = tickets.map(
    (ticket) => ({
      db_id: ticket.id,
      price: ticket.price.toFixed(2),
      quantity: ticket.quantity.toString(),
      total_tickets: ticket.quantity.toString(),
      ticket_dates: ticket.ticket_dates.map((date) => date.event_date_id),
      name: ticket.name,
      description: ticket.description || "",
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
      ticket_dates: [],
      description: "",
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
        description: ticket.description,
        ticket_dates: ticket.ticket_dates,
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
            Number(ticket.quantity) !== originalTicket.quantity ||
            (ticket.description !== originalTicket.description &&
              null !== originalTicket.description))
        );
      })
      .map((ticket) => ({
        price: ticket.price,
        quantity: ticket.quantity,
        description: ticket.description,
        ticket_dates: ticket.ticket_dates,
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
      toast.error("Failed to update tickets");
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
        <div className="space-y-10">
          {fields.map((field, index) => (
            <div>
              <div className="flex items-center mb-4">
                <p className="font-semibold text-sm">Ticket Tier {index + 1}</p>
                {!field.db_id && (
                  <Button
                    type="button"
                    variant={"link"}
                    onClick={() => removeTicket(index)}
                    className="text-red-400 hover:text-destructive duration-300 transition hover:bg-transparent"
                  >
                    Remove
                  </Button>
                )}
              </div>

              <div key={field.id} className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name={`tickets.${index}.ticket_dates`}
                  render={() => (
                    <FormItem className="col-span-2">
                      <FormLabel className="font-normal">Dates</FormLabel>
                      {field.db_id ? (
                        <div className="flex w-full justify-start gap-4">
                          {eventDates.map((date) => (
                            <FormField
                              key={date.id}
                              control={form.control}
                              name={`tickets.${index}.ticket_dates`}
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={date.id}
                                    className="flex flex-row items-center space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        disabled={true}
                                        checked={field.value?.includes(date.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                ...field.value,
                                                date.id,
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== date.id
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {date.date}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="flex w-full justify-start gap-4">
                          {eventDates.map((date) => (
                            <FormField
                              key={date.id}
                              control={form.control}
                              name={`tickets.${index}.ticket_dates`}
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={date.id}
                                    className="flex flex-row items-center space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        disabled={false}
                                        checked={field.value?.includes(date.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                ...field.value,
                                                date.id,
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== date.id
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {date.date}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                      )}

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`tickets.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
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
                  name={`tickets.${index}.price`}
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
                  name={`tickets.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputWithLabel
                          label="Tickets On Sale"
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
                  name={`tickets.${index}.description`}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormControl>
                        <TextareaWithLabel
                          label="Description"
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
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            variant={"link"}
            onClick={addTicket}
            className="text-foreground"
          >
            + Add Ticket
          </Button>
        </div>
      </motion.form>
    </Form>
  );
}
