import { Tables } from "@/types/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
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

export default async function Guests({ event }: { event: Tables<"events"> }) {
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
          <div className="flex flex-col gap-6 items-start">
            {guests?.map((guest) => (
              <div className="flex gap-3">
                <Avatar className="h-24 w-24 m-auto">
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
          </div>
        </>
      )}
    </>
  );
}
