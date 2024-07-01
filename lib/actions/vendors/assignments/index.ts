"use server";
import createSupabaseServerClient from "@/utils/supabase/server";

const saveVendorAssignment = async (
  event_id: string,
  vendor_id: string,
  type: string,
  assignment: string
) => {
  const supabase = await createSupabaseServerClient();

  const fixedAssignment: number | null =
    assignment === "null" ? null : +assignment;

  if (type === "Verified") {
    await supabase
      .from("event_vendors")
      .update({ assignment: fixedAssignment })
      .eq("event_id", event_id)
      .eq("vendor_id", vendor_id);

    await supabase
      .from("event_vendors")
      .update({ notified_of_assignment: false })
      .eq("vendor_id", vendor_id)
      .eq("event_id", event_id);
  } else {
    await supabase
      .from("temporary_vendors")
      .update({ assignment: fixedAssignment })
      .eq("event_id", event_id)
      .eq("vendor_id", vendor_id);
  }
};
export { saveVendorAssignment };
