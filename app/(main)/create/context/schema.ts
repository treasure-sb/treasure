import { isValidTime } from "@/lib/utils";
import { z } from "zod";

const basicDetailsSchema = z.object({
  name: z.string(),
  description: z.string(),
  venueName: z.string(),
});

const isPositiveNumber = (value: string) => {
  return !isNaN(parseFloat(value)) && parseFloat(value) >= 0;
};

const ticketSchema = z.object({
  name: z.string().min(1, {
    message: "Ticket name is required",
  }),
  description: z.string().optional(),
  price: z.string().refine(isPositiveNumber, {
    message: "Price must be a positive number",
  }),
  quantity: z.string().refine(isPositiveNumber, {
    message: "Quantity must be a positive number",
  }),
});

const tableSchema = z.object({
  name: z.string().min(1, {
    message: "Table name is required",
  }),
  price: z.string().refine(isPositiveNumber, {
    message: "Price must be a positive number",
  }),
  quantity: z.string().refine(isPositiveNumber, {
    message: "Quantity must be a positive number",
  }),
  tableProvided: z.boolean(),
  spaceAllocated: z.string().refine(isPositiveNumber, {
    message: "Space allocated must be a positive number",
  }),
  numberVendorsAllowed: z.string().refine(isPositiveNumber, {
    message: "Number of vendors allowed must be a positive number",
  }),
  additionalInformation: z.string().optional(),
});

const dateSchema = z.object({
  date: z.date({
    required_error: "Date is required",
  }),
  startTime: z.string().refine((value) => isValidTime(value), {
    message: "Must be a valid time (HH:mm)",
  }),
  endTime: z.string().refine((value) => isValidTime(value), {
    message: "Must be a valid time (HH:mm)",
  }),
});

const eventSchema = z.object({
  basicDetails: basicDetailsSchema,
  dates: z.array(dateSchema).nonempty({
    message: "At least one date is required",
  }),
  tickets: z.array(ticketSchema),
  tables: z.array(tableSchema),
});

type Event = z.infer<typeof eventSchema>;
type BasicDetails = z.infer<typeof basicDetailsSchema>;
type Ticket = z.infer<typeof ticketSchema>;
type Table = z.infer<typeof tableSchema>;
type Date = z.infer<typeof dateSchema>;

export { eventSchema };
export type { Event, BasicDetails, Ticket, Table, Date };
