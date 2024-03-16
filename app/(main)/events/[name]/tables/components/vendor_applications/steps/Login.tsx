"use client";
import LoginFlow from "@/app/(login)/login/components/LoginFlow";
import { useVendorFlow } from "../../../context/VendorFlowContext";
import { Tables } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";
import { validateUser } from "@/lib/actions/auth";
import { toast } from "sonner";
import { useVendorApplication } from "../../../context/VendorApplicationContext";

export default function Login() {
  const { flowDispatch } = useVendorFlow();
  const { applicationDispatch } = useVendorApplication();

  const onLoginComplete = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await validateUser();

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user?.id)
      .single();

    if (profileError) {
      toast.error("Error fetching profile");
      return;
    }

    const profile: Tables<"profiles"> = profileData;
    flowDispatch({ type: "setProfile", payload: profile });
    const vendorInfo = {
      phone: profile?.phone,
      email: profile?.email,
      firstName: profile?.first_name,
      lastName: profile?.last_name,
      businessName: profile?.business_name,
    };
    applicationDispatch({ type: "setVendorInfo", payload: vendorInfo });
  };

  return (
    <div className="mt-20 max-w-sm m-auto">
      <LoginFlow
        isDialog={true}
        action={onLoginComplete}
        heading="Enter your contact information"
      />
    </div>
  );
}
