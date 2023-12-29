import createSupabaseServerClient from "@/utils/supabase/server";
import { Tables } from "@/types/supabase";
import { redirect } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import PaymentForm from "./PaymentForm";
import { getProfile } from "@/lib/helpers/profiles";

export default async function Page({
  searchParams,
}: {
  searchParams: {
    vendor: string;
  };
}) {
  const vendorUsername = searchParams.vendor;
  const supabase = await createSupabaseServerClient();
  const { data: vendorData, error: vendorError } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", vendorUsername)
    .single();

  if (!vendorData || vendorError) {
    redirect("/");
  }

  const profile = await getProfile(vendorData.id);

  let paymentMethods = [];
  if (profile.venmo && profile.venmo !== "") {
    paymentMethods.push(["venmo", profile.venmo]);
  }
  if (profile.zelle && profile.zelle !== "") {
    paymentMethods.push(["zelle", profile.zelle]);
  }
  if (profile.cashapp && profile.cashapp !== "") {
    paymentMethods.push(["cashapp", profile.cashapp]);
  }
  if (profile.paypal && profile.paypal !== "") {
    paymentMethods.push(["paypal", profile.paypal]);
  }
  console.log(paymentMethods);

  const vendor = profile;
  const {
    data: { publicUrl },
  } = await supabase.storage.from("avatars").getPublicUrl(vendor.avatar_url);

  return (
    <main>
      <div className="space-y-2">
        <h1 className="text-lg text-center font-semibold">
          {vendor.first_name} {vendor.last_name}
        </h1>
        <Avatar className="h-28 w-28 m-auto">
          <AvatarImage src={publicUrl} />
          <AvatarFallback>
            {vendor.first_name[0]}
            {vendor.last_name[0]}
          </AvatarFallback>
        </Avatar>
      </div>
      <PaymentForm
        vendorID={vendor.id}
        paymentMethods={paymentMethods}
        route={vendor.username}
      />
    </main>
  );
}
