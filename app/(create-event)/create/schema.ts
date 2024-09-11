import { isValidTime } from "@/lib/utils";
import { z } from "zod";

const isPositiveNumber = (value: string) => {
  return !isNaN(parseFloat(value)) && parseFloat(value) >= 0;
};

const basicDetailsSchema = z.object({
  name: z.string().min(1, {
    message: "Event name is required",
  }),
  description: z.string().min(1, {
    message: "Event description is required",
  }),
  venueName: z.string().min(1, {
    message: "Venue name is required",
  }),
  venueAddress: z.object({
    address: z.string().min(1, {
      message: "Venue address is required",
    }),
    lat: z.number(),
    lng: z.number(),
    city: z.string(),
    state: z.string(),
  }),
});

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
  dates: z.array(z.date()),
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
  date: z
    .date()
    .optional()
    .refine((date) => date !== undefined, {
      message: "Date is required for submission",
    }),
  startTime: z.string().refine((value) => isValidTime(value), {
    message: "Start time is required",
  }),
  endTime: z.string().refine((value) => isValidTime(value), {
    message: "End time is required",
  }),
});

const termSchema = z.object({
  term: z.string().min(1, {
    message: "Term and Condition Required",
  }),
});

const vendorInfoSchema = z.object({
  checkInTime: z.string().refine((value) => isValidTime(value), {
    message: "Check-in time is required",
  }),
  checkInLocation: z.string().min(1, {
    message: "Location is required",
  }),
  wifiAvailability: z.boolean().default(false),
  additionalInfo: z.string().optional(),
  terms: z.array(termSchema).nonempty({
    message: "At least one term is required",
  }),
});

const eventSchema = z.object({
  poster: z.union([z.instanceof(File), z.string()]).optional(),
  venueMap: z.union([z.instanceof(File), z.string()]).optional(),
  basicDetails: basicDetailsSchema,
  dates: z.array(dateSchema).nonempty({
    message: "At least one date is required",
  }),
  tickets: z.array(ticketSchema),
  tables: z.array(tableSchema),
  vendorInfo: vendorInfoSchema,
});

type CreateEvent = z.infer<typeof eventSchema>;
type BasicDetails = z.infer<typeof basicDetailsSchema>;
type Ticket = z.infer<typeof ticketSchema>;
type Table = z.infer<typeof tableSchema>;
type Date = z.infer<typeof dateSchema>;
type VendorInfo = z.infer<typeof vendorInfoSchema>;

export { eventSchema };
export type { CreateEvent, BasicDetails, Ticket, Table, Date, VendorInfo };
