import { Tables } from "@/types/supabase";
import { Badge } from "@/components/ui/badge";
import createSupabaseServerClient from "@/utils/supabase/server";
import { EventWithDates } from "@/types/event";

export default async function Tags({ event }: { event: EventWithDates }) {
  const supabase = await createSupabaseServerClient();
  const { data: tagsData } = await supabase
    .from("event_tags")
    .select("tags(name)")
    .eq("event_id", event.id);

  return (
    tagsData && (
      <div className="flex gap-2 w-full flex-wrap">
        {tagsData.map((tag: any) => (
          <Badge variant={"tertiary"} className="p-1 px-4" key={tag.id}>
            {tag.tags.name}
          </Badge>
        ))}
      </div>
    )
  );
}
