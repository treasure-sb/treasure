import createSupabaseServerClient from "@/utils/supabase/server";
import { PostgrestError } from "@supabase/supabase-js";

interface FeeInfoResponse {
  fee: number;
  collectStripeFee: boolean;
  returnedError: PostgrestError | null;
}

type FeeData = {
  subscription_products: {
    name: string;
  };
  status: string;
};

export const getFeeInfo = async (
  event_id: string
): Promise<FeeInfoResponse> => {
  let fee: number = 0;
  let collectStripeFee: boolean = false;
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
    .select("subscription_products(service_fee, stripe_fee), status")
    .eq("user_id", data?.user_id)
    .returns<FeeInfoResponse>();

  if (error) {
    returnedError = error;
    console.log("Event roles error", returnedError);
  } else if (feeError) {
    returnedError = feeError;
    console.log("subscriptions error", returnedError);
    console.log(data.user_id);
  } else {
    collectStripeFee = feeData?.collectStripeFee;
    fee = feeData?.fee;
  }
  console.log(feeData);

  return { fee, collectStripeFee, returnedError };
};
