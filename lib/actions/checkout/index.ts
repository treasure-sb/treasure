"use server";
import { Tables } from "@/types/supabase";
import createSupabaseServerClient from "@/utils/supabase/server";

interface CheckoutSession {
  event_id: string;
  ticket_id: string;
  ticket_type: string;
  user_id: string;
  quantity: number;
  price_type?: string;
  metadata?: any;
}

const createCheckoutSession = async (session: CheckoutSession) => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("checkout_sessions")
    .insert([session])
    .select()
    .single();

  if (error) {
    return { data: null, error };
  }

  const checkoutSessionData: Tables<"checkout_sessions"> = data;

  return { data: checkoutSessionData, error };
};

export { createCheckoutSession };
