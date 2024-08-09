import { EventWithDates } from "@/types/event";

type EventVendorQueryData = {
  application_status: string;
  profile: {
    username: string;
    avatar_url: string;
    first_name: string;
    last_name: string;
    business_name: string;
  };
  event: EventWithDates & {
    roles: {
      user_id: string;
      role: string;
      status: string;
    }[];
  };
};

type EventVendorData = {
  applicationStatus: string;
  profile: {
    username: string;
    firstName: string;
    lastName: string;
    businessName: string;
    publicAvatarUrl: string;
  };
  event: EventWithDates;
};

export type { EventVendorData, EventVendorQueryData };
