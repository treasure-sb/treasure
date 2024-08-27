"use client";
import LoginFlow from "@/app/(login)/login/components/LoginFlow";
import { useVendorFlow } from "../../../context/VendorFlowContext";
import { Tables } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";
import { validateUser } from "@/lib/actions/auth";
import { toast } from "sonner";
import { useVendorApplication } from "../../../context/VendorApplicationContext";
import { formatPhoneNumber } from "@/components/ui/custom/phone-input";
import type { Link, ProfileWithApplicationInfo } from "../../../types";

export default function Login() {
  const { tags, flowDispatch } = useVendorFlow();
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

    const { data: inventoryData, error: err } = await supabase
      .from("event_vendors")
      .select("*")
      .eq("vendor_id", user?.id)
      .order("created_at", { ascending: false });

    const inventoryDataSingle: Tables<"event_vendors"> =
      inventoryData === null ? {} : inventoryData[0];

    console.log("event_id", inventoryDataSingle?.event_id);

    const { data: profileTagsData } = await supabase
      .from("event_vendor_tags")
      .select("tags(id,name)")
      .eq("vendor_id", user?.id)
      .eq("event_id", inventoryDataSingle?.event_id);

    let profile: Tables<"profiles"> = profileData;
    profile.phone =
      profile.phone === null
        ? inventoryDataSingle?.application_phone
        : profile.phone;
    profile.email =
      profile.email === null
        ? inventoryDataSingle?.application_email
        : profile.email;

    const links: Link[] = linksData || [];
    const inventory: string = inventoryDataSingle?.inventory || "";
    const userTags: Tables<"tags">[] =
      profileTagsData?.map((tag) => {
        // @ts-ignore
        return { id: tag.tags.id, name: tag.tags.name };
      }) || [];

    const profileWithApplicationInfo: ProfileWithApplicationInfo | null = {
      ...profile,
      instagram: links.find((link) => link.application === "Instagram")
        ?.username,
      inventory: inventory,
      tags: userTags,
    };

    flowDispatch({ type: "setProfile", payload: profileWithApplicationInfo });

    const vendorInfo = {
      phone: formatPhoneNumber(
        profile.phone?.slice(profile?.phone.length - 10) || ""
      ),
      email: profile.email,
      firstName: profile.first_name,
      lastName: profile.last_name,
      businessName: profile.business_name,
      instagram: profileWithApplicationInfo.instagram,
    };

    let autoFillTags: Tables<"tags">[] = [];
    profileWithApplicationInfo.tags?.forEach((pTag) => {
      tags.forEach((eTag) => {
        if (pTag.id === eTag.id) autoFillTags.push(eTag);
      });
    });

    applicationDispatch({ type: "setVendorInfo", payload: vendorInfo });
    applicationDispatch({ type: "setInventory", payload: inventory });
    applicationDispatch({ type: "setVendorTags", payload: autoFillTags });
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
