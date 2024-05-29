import { Tables } from "@/types/supabase";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AddEventGuests from "./AddEventGuests";
import createSupabaseServerClient from "@/utils/supabase/server";

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
  event: Tables<"events">;
}) {
  const supabase = await createSupabaseServerClient();
  const { data: guestsData } = await supabase
    .from("event_guests")
    .select("*")
    .eq("event_id", event.id);

  let guests = guestsData || [];

  guests = (await getGuestsPublicUrl(guests)) as (Tables<"event_guests"> & {
    publicUrl: string;
  })[];

  return (
    <>
      <Separator />
      <h3 className="font-semibold text-lg mb-4">Edit Guests</h3>
      <div className="flex flex-col space-y-4 items-start">
        {guests?.map((guest) => (
          <div className="flex space-x-4">
            <Avatar className="h-32 w-32 m-auto">
              <AvatarImage src={guest.publicUrl} />
              <AvatarFallback>{`${guest.name[0]}`}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col justify-center text-left">
              <h2 className="font-semibold text-xl">{guest.name}</h2>
              <p className="text-sm whitespace-pre-line text-gray-500">
                {guest.bio}
              </p>
            </div>
          </div>
        ))}
        <AddEventGuests event={event} />
      </div>
    </>
  );
}
