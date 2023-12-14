import { Tables } from "@/types/supabase";
import createSupabaseServerClient from "@/utils/supabase/server";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function HostedBy({ event }: { event: Tables<"events"> }) {
  const supabase = await createSupabaseServerClient();
  const { data: userData, error: userError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", event.organizer_id)
    .single();

  const user: Tables<"profiles"> = userData;

  // avatar for organizer
  const {
    data: { publicUrl: organizerPublicUrl },
  } = await supabase.storage.from("avatars").getPublicUrl(user.avatar_url);

  return (
    <>
      <h1 className="font-semibold text-2xl">Hosted By</h1>
      <div className="flex flex-col space-y-1 items-center">
        <Link href={`/users/${user.username}`}>
          <Avatar className="h-24 w-24 m-auto">
            <AvatarImage src={organizerPublicUrl} />
            <AvatarFallback>
              {user.first_name[0]}
              {user.last_name[0]}
            </AvatarFallback>
          </Avatar>
        </Link>
        <span>@{user.username}</span>
      </div>
    </>
  );
}
