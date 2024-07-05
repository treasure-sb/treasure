"use server";

import createSupabaseServerClient from "@/utils/supabase/server";
import { TempVendorCreateProps } from "@/app/(dashboards)/host/events/[name]/(tools)/vendors/components/temp_vendors/add_temp_vendor/CreateTempVendor";

const createTemporaryVendor = async (
  vendorForm: TempVendorCreateProps,
  creatorId: string
) => {
  const supabase = await createSupabaseServerClient();
  const { business_name, instagram, avatar_url, email } = vendorForm;

  const { data, error } = await supabase
    .from("temporary_profiles_vendors")
    .insert([
      { business_name, avatar_url, instagram, email, creator_id: creatorId },
    ])
    .select();

  console.log(data, error);
  return { data, error };
};

const fetchTemporaryVendors = async (search: string) => {
  const supabase = await createSupabaseServerClient();
  const { data: profilesData } = await supabase
    .from("temporary_profiles_vendors")
    .select("*, temporary_vendors(event_id)")
    .or(`business_name.ilike.%${search}%`)
    .limit(8);

  if (profilesData) {
    const profilesWithAvatar = await Promise.all(
      profilesData.map(async (profile) => {
        const {
          data: { publicUrl },
        } = await supabase.storage
          .from("avatars")
          .getPublicUrl(profile.avatar_url);
        return {
          ...profile,
          avatar_url: publicUrl,
        };
      })
    );
    return profilesWithAvatar;
  }
  return [];
};

export { createTemporaryVendor, fetchTemporaryVendors };
