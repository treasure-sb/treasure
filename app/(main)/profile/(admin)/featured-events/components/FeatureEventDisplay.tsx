import { Tables } from "@/types/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import createSupabaseServerClient from "@/utils/supabase/server";
import EventImage from "@/components/events/shared/EventImage";

export default function FeatureEventDisplay({
  event,
}: {
  event: Partial<Tables<"events">>;
}) {
  const updateWeight = async (formData: FormData) => {
    "use server";
    const supabase = await createSupabaseServerClient();
    const weight = formData.get("weight");
    const { data, error } = await supabase
      .from("events")
      .update({ featured: weight })
      .eq("id", event.id);
  };

  return (
    <div>
      <div className="aspect-h-1 aspect-w-1">
        <EventImage event={event} />
      </div>
      <h1 className="text-primary mt-2">{event.name}</h1>
      <form action={updateWeight} className="flex items-end">
        <Input
          type="number"
          name="weight"
          defaultValue={event.featured}
          placeholder="Feature Weight"
        />
        <Button type="submit" variant={"outline"} className="w-fit">
          Update Weight
        </Button>
      </form>
    </div>
  );
}
