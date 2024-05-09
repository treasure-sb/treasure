import { Tables } from "@/types/supabase";
import { Separator } from "@/components/ui/separator";
import { type TagData } from "../../types";
import createSupabaseServerClient from "@/utils/supabase/server";
import ListVendors from "./ListVendors";

export enum VendorTypes {
  PROFILE,
  TEMP_PROFILE,
}

export type Vendor = {
  username: string;
  avatarUrl: string;
  publicUrl: string;
  type: VendorTypes;
  businessName: string | null;
  firstName: string | null;
  lastName: string | null;
  bio: string | null;
  tags: string[];
};

type ProfileVendor = {
  profile: Tables<"profiles">;
  tags: TagData[];
};

type TempProfileVendor = {
  profile: Tables<"temporary_profiles">;
  tags: Tables<"tags">;
};

const createVendorFromProfile = (profile: ProfileVendor) => {
  const { profile: vendorProfile, tags } = profile;
  return {
    username: vendorProfile.username,
    avatarUrl: vendorProfile.avatar_url,
    publicUrl: "",
    type: VendorTypes.PROFILE,
    businessName: vendorProfile.business_name,
    firstName: vendorProfile.first_name,
    lastName: vendorProfile.last_name,
    bio: vendorProfile.bio,
    tags: tags.map((tag) => tag.tags.name),
  };
};

const createVendorFromTempProfile = (tempProfile: TempProfileVendor) => {
  const { profile: vendorProfile, tags } = tempProfile;
  return {
    username: vendorProfile.username,
    avatarUrl: vendorProfile.avatar_url,
    publicUrl: "",
    type: VendorTypes.TEMP_PROFILE,
    businessName: vendorProfile.business_name,
    firstName: null,
    lastName: null,
    bio: null,
    tags: [tags.name],
  };
};

const getVendorsWithPublicUrl = async (vendors: Vendor[]) => {
  const supabase = await createSupabaseServerClient();
  return Promise.all(
    vendors.map(async (vendor) => {
      const {
        data: { publicUrl },
      } = await supabase.storage.from("avatars").getPublicUrl(vendor.avatarUrl);
      return { ...vendor, publicUrl: publicUrl };
    })
  );
};

export default async function Vendors({ event }: { event: Tables<"events"> }) {
  const supabase = await createSupabaseServerClient();
  const { data: vendorsData } = await supabase
    .from("event_vendors")
    .select("profile:profiles(*), tags:event_vendor_tags(tags(*))")
    .eq("event_id", event.id)
    .eq("payment_status", "PAID")
    .returns<ProfileVendor[]>();

  const { data: tempVendorData } = await supabase
    .from("temporary_vendors")
    .select("profile:temporary_profiles(*), tags(*)")
    .eq("event_id", event.id)
    .returns<TempProfileVendor[]>();

  const { data: tagsData } = await supabase
    .from("event_tags")
    .select("tags(*)")
    .eq("event_id", event.id)
    .returns<TagData[]>();

  const tags = tagsData || [];

  const profileVendors: Vendor[] =
    vendorsData?.flatMap((vendor) => createVendorFromProfile(vendor)) || [];

  const tempVendors: Vendor[] =
    tempVendorData?.flatMap((vendor) => createVendorFromTempProfile(vendor)) ||
    [];

  const allVendors = [
    ...(await getVendorsWithPublicUrl(profileVendors)),
    ...(await getVendorsWithPublicUrl(tempVendors)),
  ];

  return (
    allVendors.length > 0 && (
      <>
        <h3 className="font-semibold text-lg mb-4">Vendors</h3>
        <ListVendors allVendors={allVendors} tags={tags} />
        <Separator />
      </>
    )
  );
}
