import createSupabaseServerClient from "@/utils/supabase/server";
import Image from "next/image";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

export default async function Page({ params }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient();
  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", params.id)
    .single();

  const data = await supabase.storage
    .from("posters")
    .getPublicUrl(event.poster_url);
  const formattedDate = format(new Date(event.date), "EEE, MMMM do");
  console.log(event);
  return (
    <main className="m-auto w-fit">
      <div className="mt-10 flex flex-col lg:flex-row lg:space-x-10">
        <Image
          className="rounded-xl lg:hidden mb-6 lg:mb-0"
          alt="image"
          src={data.data.publicUrl}
          width={500}
          height={500}
        />
        <Image
          className="rounded-xl hidden lg:block mb-6 lg:mb-0"
          alt="image"
          src={data.data.publicUrl}
          width={600}
          height={600}
        />
        <div className="space-y-6">
          <h1 className="text-4xl font-semibold">{event.name}</h1>
          <div>
            <h1>Location</h1>
            <h1>{formattedDate}</h1>
          </div>
          <div>
            <h1>Tags go here</h1>
          </div>
          <div>
            <h1>Prices go here</h1>
          </div>
          <h1>City, State</h1>
          <div>
            <h1 className="font-semibold text-2xl">About</h1>
            <p>{event.description}</p>
          </div>
          <div>
            <h1 className="font-semibold text-2xl">Vendors</h1>
            <h1>Vendors list goes here</h1>
          </div>
          <Button className="mt-6 w-full">Edit Event</Button>
        </div>
      </div>
    </main>
  );
}
