import * as z from "zod";

const eventFormSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  description: z.string().min(1, {
    message: "Description is required",
  }),
  venueName: z.string().min(1, {
    message: "Location name is required",
  }),
  venueAddress: z.string().min(1, {
    message: "Location address is required",
  }),
  date: z.date({
    required_error: "Date is required",
  }),
  ticketPrice: z.string().refine(
    (num) => {
      return !isNaN(Number(num)) && Number(num) > 0;
    },
    {
      message: "Must be a valid ticket price",
    }
  ),
  ticketQuantity: z.string().refine(
    (num) => {
      return !isNaN(Number(num)) && Number(num) > 0;
    },
    {
      message: "Must be a valid ticket price",
    }
  ),
});

export { eventFormSchema };
