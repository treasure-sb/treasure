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
    end_date: null,
    status: "ACTIVE",
    subscribed_product_id: product_id.data?.id,
  });
}
