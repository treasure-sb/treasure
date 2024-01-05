import createSupabaseServerClient from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import PaymentForm from "./PaymentForm";
import { getProfile, getProfileLinks } from "@/lib/helpers/profiles";

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

  const { profile } = await getProfile(vendorData.id);
  const { links } = await getProfileLinks(vendorData.id);
  const paymentMethods: string[][] = [];

  const filteredLinks = links.filter((link) => link.type === "payment");
  filteredLinks.forEach((link) => {
    paymentMethods.push([link.application, link.username]);
  });
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
