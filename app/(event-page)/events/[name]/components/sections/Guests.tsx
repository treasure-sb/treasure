import { Tables } from "@/types/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { EventWithDates } from "@/types/event";
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

export default async function Guests({ event }: { event: EventWithDates }) {
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
      {guests?.length > 0 && (
        <>
          <Separator />
          <h3 className="font-semibold text-lg mb-4">Guests</h3>
          <div className="grid grid-cols-1 gap-2 items-start">
            {guests?.map((guest) => (
              <Card className="flex space-x-4 p-4 w-full lg:w-[80%] items-center">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={guest.publicUrl} />
                  <AvatarFallback>{`${guest.name[0]}`}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col justify-center text-left">
                  <p className="font-semibold text-lg">{guest.name}</p>
                  <p className="text-xs lg:text-sm whitespace-pre-line text-gray-500">
                    {guest.bio}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </>
  );
}
