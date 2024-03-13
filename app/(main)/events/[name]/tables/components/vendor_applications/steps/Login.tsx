"use client";
import LoginFlow from "@/app/(login)/login/components/LoginFlow";
import { useVendorFlowStore } from "../../../store";
import { Tables } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";
import { validateUser } from "@/lib/actions/auth";
import { toast } from "sonner";

export default function Login() {
  const { setProfile } = useVendorFlowStore();

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
    setProfile(profile);
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
