import { Suspense } from "react";
import { Tables } from "@/types/supabase";
import { validateUser } from "@/lib/actions/auth";
import { getProfile } from "@/lib/helpers/profiles";
import { getPublicPosterUrl } from "@/lib/helpers/events";
import { unstable_noStore as noStore } from "next/cache";
import CreateEvent from "./components/CreateEvent";
import createSupabaseServerClient from "@/utils/supabase/server";

type Ticket = Omit<
  Tables<"tickets">,
  "id" | "event_id" | "created_at" | "total_tickets"
> & {
  dates: {
    date: {
      date: string | null;
    };
  }[];
};
type Table = Omit<Tables<"tables">, "id" | "event_id" | "total_tables">;
type EventDate = Omit<Tables<"event_dates">, "id" | "event_id">;
type Terms = Omit<
  Tables<"application_terms_and_conditions">,
  "id" | "event_id"
>;
type VendorInfo = Omit<
  Tables<"application_vendor_information">,
  "id" | "event_id"
>;

export type AllEventData = Tables<"events"> & {
  dates: EventDate[];
  tickets: Ticket[];
  tags: {
    tag: Tables<"tags">;
  }[];
  terms: Terms[];
  vendorInfo: VendorInfo;
  tables: Table[];
};

export default async function Page({
  searchParams,
}: {
  searchParams: {
    d?: string;
  };
}) {
  noStore();
  const supabase = await createSupabaseServerClient();
  const { data: allTagsData } = await supabase.from("tags").select("*");
  const tags: Tables<"tags">[] = allTagsData || [];

  const draftId = searchParams.d || null;
  let draft: AllEventData | null = null;

  if (draftId) {
    const { data: draftData, error: draftError } = await supabase
      .from("events")
      .select(
        `*, 
          dates:event_dates(date, start_time, end_time), 
          tickets(price, quantity, description, name, dates:ticket_dates(date:event_dates(date))),
          tags:event_tags(tag:tags(*)),
          terms:application_terms_and_conditions(term),
          vendorInfo:application_vendor_information(check_in_time, check_in_location, 
                          wifi_availability, additional_information),
          tables(section_name, price, quantity, table_provided, space_allocated, number_vendors_allowed, 
                          additional_information, table_provided)
        `
      )
      .eq("id", draftId)
      .single();

    if (!draftError) {
      draft = draftData;
      const posterUrl = await getPublicPosterUrl(draft!.poster_url);
      draft!.poster_url = posterUrl;
    }
  }

  const {
    data: { user },
  } = await validateUser();

  const { profile } = await getProfile(user?.id);

  return (
    <Suspense>
      <CreateEvent tags={tags} user={profile} draft={draft} eventId={draftId} />
    </Suspense>
  );
}
