"use server";
import createSupabaseServerClient from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const submitVendorApp = async ({
  collection_type,
  contact,
  event_id,
}: {
  collection_type: string;
  contact: string;
  event_id: string;
}) => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check if vendor has already applied
  const { data: alreadyApplied, error: pError } = await supabase
    .from("vendor_applications")
    .select("*")
    .eq("event_id", event_id)
    .eq("vendor_id", user?.id);

  if (!alreadyApplied || alreadyApplied.length === 0) {
    const { data, error } = await supabase
      .from("vendor_applications")
      .insert({ event_id, vendor_id: user?.id, collection_type, contact })
      .select();

    if (!error) {
      redirect("/events?applied");
    }
  } else {
    redirect("/events?error");
  }
};

export { submitVendorApp };
