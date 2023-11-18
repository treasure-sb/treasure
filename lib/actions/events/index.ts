"use server";
import createSupabaseServerClient from "@/utils/supabase/server";
import * as z from "zod";
import { eventFormSchema } from "@/lib/schemas/events";

const supabase = createSupabaseServerClient();

const createEvent = async (values: z.infer<typeof eventFormSchema>) => {
  console.log(values);
};

export { createEvent };
