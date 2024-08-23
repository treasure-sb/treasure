import createSupabaseServerClient from "@/utils/supabase/server";

type FeeData = {
  subscription_products: {
    service_fee: number;
    stripe_fee: boolean;
  };
  status: string;
};

export const getFeeInfo = async (event_id: string) => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("event_roles")
    .select("user_id")
    .eq("event_id", event_id)
    .eq("role", "HOST")
    .single();

  if (error) {
    return { error: true, data: null };
  }

  const { data: feeData, error: feeError } = await supabase
    .from("subscriptions")
    .select("subscription_products(service_fee, stripe_fee), status")
    .eq("user_id", data?.user_id)
    .returns<FeeData[]>()
    .single();

  if (feeError) {
    return { error: true, data: null };
  }

  const { service_fee, stripe_fee } = feeData.subscription_products;

  return {
    error: null,
    data: { fee: service_fee, collectStripeFee: stripe_fee },
  };
};
