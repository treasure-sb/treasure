import { Tables } from "@/types/supabase";
import createSupabaseServerClient from "@/utils/supabase/server";
import { timeStamp } from "console";

export async function newProfileToBasic(
  profileData: Tables<"profiles"> | null
) {
  const supabase = await createSupabaseServerClient();
  const product_id = await supabase
    .from("subscription_products")
    .select("id")
    .eq("name", "Basic")
    .single();
  const { data, error } = await supabase.from("subscriptions").insert({
    user_id: profileData?.id,
    start_date: new Date().toISOString,
    end_date: null,
    created_at: new Date().toISOString,
    status: "ACTIVE",
    subscribed_product_id: product_id,
  });
}
