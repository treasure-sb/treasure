"use server";
import createSupabaseServerClient from "@/utils/supabase/server";

interface CheckoutSession {
  event_id: string;
  ticket_id: string;
  ticket_type: string;
  user_id: string;
  quantity: number;
  price_type?: string;
}

const createCheckoutSession = async (session: CheckoutSession) => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("checkout_sessions")
    .insert([session])
    .select()
    .single();
  return { data, error };
};

export { createCheckoutSession };
