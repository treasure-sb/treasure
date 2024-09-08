"use server";

import createSupabaseServerClient from "@/utils/supabase/server";
import { z } from "zod";
import { PromoFormSchema } from "@/app/(dashboards)/host/events/[name]/(tools)/sales/types";

const createPromoCode = async (
  eventId: string | null,
  promoForm: z.infer<typeof PromoFormSchema>,
  admin?: boolean
) => {
  const supabase = await createSupabaseServerClient();
  const { code, discount, status, usageLimit, promoType } = promoForm;
  const { data, error } = await supabase.from("event_codes").insert({
    code: code.toUpperCase(),
    discount,
    status,
    usage_limit: usageLimit || null,
    type: promoType,
    event_id: eventId || null,
    treasure_sponsored: admin ? true : false,
  });

  return { data, error };
};

const updatePromoCode = async (
  eventId: string | null,
  promoForm: z.infer<typeof PromoFormSchema>
) => {
  const supabase = await createSupabaseServerClient();
  const { code, discount, status, usageLimit, id, promoType } = promoForm;
  const { data, error } = await supabase
    .from("event_codes")
    .update({
      code: code.toUpperCase(),
      discount,
      status,
      usage_limit: usageLimit || null,
      type: promoType,
    })
    .eq("id", id);

  return { data, error };
};

export { createPromoCode, updatePromoCode };
