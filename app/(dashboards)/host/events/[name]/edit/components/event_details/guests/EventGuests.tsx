import { Tables } from "@/types/supabase";
import { Separator } from "@/components/ui/separator";
import AddEventGuests from "./AddEventGuests";
import createSupabaseServerClient from "@/utils/supabase/server";
import { EventDisplayData } from "@/types/event";
import EditEventGuest from "./EditEventGuests";

export type Guest = Tables<"event_guests"> & { publicUrl: string };

const getGuestsPublicUrl = async (guests: Tables<"event_guests">[]) => {
  const supabase = await createSupabaseServerClient();
  return Promise.all(
    guests.map(async (guest) => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from("guest_images")
        .getPublicUrl(guest.avatar_url);
      return { ...guest, publicUrl: publicUrl };
    })
  );
};

export default async function EventGuests({
  event,
}: {
  event: EventDisplayData;
}) {
  const supabase = await createSupabaseServerClient();
  const { data: guestsData } = await supabase
    .from("event_guests")
    .select("*")
    .eq("event_id", event.id);

  const eventGuests: Tables<"event_guests">[] = guestsData || [];
  const guests = (await getGuestsPublicUrl(eventGuests)) || [];

  return (
    <>
      <Separator />
      <h3 className="font-semibold text-lg mb-4">Edit Guests</h3>
      <div className="flex flex-col space-y-4 items-start">
        {guests?.map((guest) => (
          <EditEventGuest key={guest.id} guest={guest} />
        ))}
        <AddEventGuests event={event} />
      </div>
    </>
  );
}
