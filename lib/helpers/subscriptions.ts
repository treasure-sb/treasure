import createSupabaseServerClient from "@/utils/supabase/server";
import { PostgrestError } from "@supabase/supabase-js";

interface FeeInfoResponse {
  fee: number | null;
  returnedError: PostgrestError | null;
}

export const getFeeInfo = async (
  event_id: string
): Promise<FeeInfoResponse> => {
  let fee: number | null = null;
  let returnedError: PostgrestError | null = null;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("event_roles")
    .select("user_id")
    .eq("event_id", event_id)
    .eq("role", "HOST")
    .single();

  const { data: feeData, error: feeError } = await supabase
    .from("subscriptions")
    .select("subscription_products(name), status")
    .eq("user_id", data?.user_id)
    .single();

  if (error) {
    returnedError = error;
    console.log("Event roles error");
  } else if (feeError) {
    returnedError = feeError;
    console.log("subscriptions error");
    console.log(data.user_id);
  }
  console.log(feeData);
  if (feeData?.subscription_products) {
    const firstProductName = feeData.subscription_products.name as string;
    console.log(firstProductName, feeData);
    switch (firstProductName) {
      case "Legacy":
        fee = null;
        break;
      case "Pro":
        fee = 0.02;
        break;
      case "Basic":
        fee = 0.04;
        break;
      default:
        fee = null;
    }
  }

  return { fee, returnedError };
};
