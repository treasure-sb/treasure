"use server";

import createSupabaseServerClient from "@/utils/supabase/server";
import { z } from "zod";
import { PromoFormSchema } from "@/app/(dashboards)/host/events/[name]/(tools)/sales/components/promo/AddPromoButton";

const createPromoCode = async (
  eventId: string,
  promoForm: z.infer<typeof PromoFormSchema>
) => {
  const supabase = await createSupabaseServerClient();
  const { code, discount, status, usageLimit } = promoForm;
  const { data, error } = await supabase.from("event_codes").insert({
    code,
    discount,
    status,
    usage_limit: usageLimit,
    event_id: eventId,
  });

  return { data, error };
};

const updatePromoCode = async (eventId: string) => {};

export { createPromoCode };
