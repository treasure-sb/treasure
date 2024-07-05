"use server";

import createSupabaseServerClient from "@/utils/supabase/server";
import { z } from "zod";
import { TempVendorSchema } from "@/app/(dashboards)/host/events/[name]/(tools)/vendors/components/temp_vendors/add_temp_vendor/AddTempVendor";

const createTemporaryVendor = async (
  vendorForm: z.infer<typeof TempVendorSchema>,
  creatorId: string
) => {
  const supabase = await createSupabaseServerClient();
  const { business_name, instagram } = vendorForm;

  const { data, error } = await supabase
    .from("temporary_profiles_vendors")
    .insert([
      { business_name, avatar_url: "", instagram, creator_id: creatorId },
    ])
    .select();

  return { data, error };
};

const fetchTemporaryVendors = async (search: string) => {
  const supabase = await createSupabaseServerClient();
  const { data: profilesData } = await supabase
    .from("temporary_profiles_vendors")
    .select("*")
    .or(`business_name.ilike.%${search}%`)
    .limit(8);

  console.log(profilesData, search);

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
