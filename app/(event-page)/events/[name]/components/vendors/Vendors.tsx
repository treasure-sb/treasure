import { Tables } from "@/types/supabase";
import { Separator } from "@/components/ui/separator";
import { type TagData } from "../../types";
import createSupabaseServerClient from "@/utils/supabase/server";
import ListVendors from "./ListVendors";
import { EventWithDates } from "@/types/event";

export enum VendorTypes {
  PROFILE,
  TEMP_PROFILE,
}

export type Vendor = {
  username: string | null;
  avatarUrl: string;
  publicUrl: string;
  type: VendorTypes;
  businessName: string | null;
  firstName: string | null;
  lastName: string | null;
  bio: string | null;
  tags: string[];
  links: Link[];
  inventory: string | null;
  assignment: string | null;
};

type ProfileVendor = {
  inventory: string;
  assignment: string | null;
  profile: Tables<"profiles"> & {
    links: Link[];
  };
  tags: TagData[];
};

type TempProfileVendor = {
  assignment: string | null;
  profile: Tables<"temporary_profiles_vendors">;
  tags: Tables<"tags">;
};

type Link = {
  username: string;
  application: string;
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
    links: vendorProfile.links,
    inventory: profile.inventory,
    assignment: profile.assignment,
  };
};

const createVendorFromTempProfile = (tempProfile: TempProfileVendor) => {
  const { profile: vendorProfile, tags } = tempProfile;
  if (!vendorProfile) {
    return [];
  }
  const instagramLink = vendorProfile.instagram
    ? [{ username: vendorProfile.instagram, application: "Instagram" }]
    : [];

  return {
    username: null,
    avatarUrl: vendorProfile.avatar_url,
    publicUrl: "",
    type: VendorTypes.TEMP_PROFILE,
    businessName: vendorProfile.business_name,
    firstName: null,
    lastName: null,
    bio: null,
    tags: [tags && tags.name],
    links: instagramLink,
    inventory: null,
    assignment: null,
  };
};

const getVendorsWithPublicUrl = async (vendors: Vendor[]) => {
  const supabase = await createSupabaseServerClient();
  return Promise.all(
    vendors.map(async (vendor) => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from("avatars")
        .getPublicUrl(vendor.avatarUrl, {
          transform: {
            width: 200,
            height: 200,
          },
        });
      return { ...vendor, publicUrl: publicUrl };
    })
  );
};

export default async function Vendors({ event }: { event: EventWithDates }) {
  const supabase = await createSupabaseServerClient();
  const { data: vendorsData } = await supabase
    .from("event_vendors")
    .select(
      "inventory, assignment, profile:profiles(*, links(username, application, type)), tags:event_vendor_tags(tags(*))"
    )
    .eq("event_id", event.id)
    .eq("payment_status", "PAID")
    .eq("profile.links.type", "social")
    .returns<ProfileVendor[]>();

  const { data: tempVendorData } = await supabase
    .from("temporary_vendors")
    .select("assignment, profile:temporary_profiles_vendors(*), tags(*)")
    .eq("event_id", event.id)
    .returns<TempProfileVendor[]>();

  const profileVendors: Vendor[] =
    vendorsData?.flatMap((vendor) => createVendorFromProfile(vendor)) || [];

  const tempVendors: Vendor[] =
    tempVendorData?.flatMap((vendor) => createVendorFromTempProfile(vendor)) ||
    [];

  const allVendors = [
    ...(await getVendorsWithPublicUrl(profileVendors)),
    ...(await getVendorsWithPublicUrl(tempVendors)),
  ];

  const allTags = new Set(allVendors.flatMap((vendor) => vendor.tags));
  const tags = Array.from(allTags);

  return (
    allVendors.length > 0 && (
      <>
        <Separator />
        <h3 className="font-semibold text-lg mb-2">Vendors</h3>
        <ListVendors allVendors={allVendors} tags={tags} />
      </>
    )
  );
}
