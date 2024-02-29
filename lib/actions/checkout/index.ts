"use server";
import createSupabaseServerClient from "@/utils/supabase/server";

interface CheckoutSession {
  event_id: string;
  ticket_id: string;
  ticket_type: string;
  user_id: string;
  quantity: number;
}

const createCheckoutSession = async (session: CheckoutSession) => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("checkout_sessions")
    .insert([session])
    .select();
  return { data, error };
};

export { createCheckoutSession };
