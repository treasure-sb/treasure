import { Tables } from "@/types/supabase";
import { Badge } from "@/components/ui/badge";
import createSupabaseServerClient from "@/utils/supabase/server";

export default async function Tags({ event }: { event: Tables<"events"> }) {
  const supabase = await createSupabaseServerClient();
  const { data: tagsData, error: tagsError } = await supabase
    .from("event_tags")
    .select("tags(name)")
    .eq("event_id", event.id);

  return (
    <>
      {tagsData ? (
        <div className="flex gap-2 w-full flex-wrap">
          {tagsData.map((tag: any) => (
            <Badge
              className="bg-tertiary p-1 px-4 hover:bg-tertiary text-black"
              key={tag.id}
            >
              {tag.tags.name}
            </Badge>
          ))}
        </div>
      ) : null}
    </>
  );
}
