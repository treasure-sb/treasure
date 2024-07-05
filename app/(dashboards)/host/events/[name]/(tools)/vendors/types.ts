import { Tables } from "@/types/supabase";

type TagNameData = {
  tags: { name: string };
};

type EventVendorTableInfo = {
  section_name: string;
  id: string;
};

type EventVendorData = Tables<"event_vendors"> & {
  vendor: Tables<"profiles"> & {
    links: {
      username: string;
      application: string;
    }[];
  };
} & {
  table: EventVendorTableInfo;
} & {
  tags: {
    tags: {
      name: string;
    };
  }[];
};

export type { EventVendorData, EventVendorTableInfo, TagNameData };
