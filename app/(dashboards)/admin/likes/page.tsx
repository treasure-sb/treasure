import createSupabaseServerClient from "@/utils/supabase/server";
import { Heart } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default async function Page() {
  const supabase = await createSupabaseServerClient();

  const { data: likes, error } = await supabase
    .from("event_likes")
    .select("liked_on, profiles(*), events(*)")
    .order("liked_on", { ascending: false })
    .order("profiles(business_name)", { ascending: true })
    .order("profiles(first_name)", { ascending: true });

  return (
    <div className="flex flex-col gap-2">
      {likes?.map((like: any) => (
        <div className="flex gap-4">
          <p>{formatDate(like.liked_on)}</p>
          <Link href={`/u/${like.profiles.username}`}>
            {like.profiles.business_name !== null
              ? like.profiles.business_name
              : like.profiles.first_name + " " + like.profiles.last_name}
          </Link>
          <Heart />
          <p>{like.events.name}</p>
        </div>
      ))}
    </div>
  );
}
