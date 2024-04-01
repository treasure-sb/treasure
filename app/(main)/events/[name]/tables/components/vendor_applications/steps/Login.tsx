"use client";
import LoginFlow from "@/app/(login)/login/components/LoginFlow";
import { useVendorFlow } from "../../../context/VendorFlowContext";
import { Tables } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";
import { validateUser } from "@/lib/actions/auth";
import { toast } from "sonner";
import { useVendorApplication } from "../../../context/VendorApplicationContext";
import { formatPhoneNumber } from "@/components/ui/custom/phone-input";
import { Link, ProfileWithInstagram } from "../../../page";

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

    const { data: linksData } = await supabase
      .from("links")
      .select("username, application")
      .eq("user_id", user?.id);

    const profile: Tables<"profiles"> = profileData;
    const links: Link[] = linksData || [];
    const profileWithInstagram: ProfileWithInstagram | null = {
      ...profile,
      instagram: links.find((link) => link.application === "Instagram")
        ?.username,
    };

    flowDispatch({ type: "setProfile", payload: profileWithInstagram });

    const vendorInfo = {
      phone: formatPhoneNumber(
        profile.phone?.slice(profile?.phone.length - 10) || ""
      ),
      email: profile.email,
      firstName: profile.first_name,
      lastName: profile.last_name,
      businessName: profile.business_name,
      instagram: profileWithInstagram.instagram,
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
