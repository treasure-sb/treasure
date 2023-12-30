import { Tables } from "@/types/supabase";
import createSupabaseServerClient from "@/utils/supabase/server";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type OrganizerType = Tables<"profiles"> | Tables<"temporary_profiles">;

export default async function HostedBy({ event }: { event: Tables<"events"> }) {
  const supabase = await createSupabaseServerClient();
  let organizer: OrganizerType;
  let type = "profile";
  if (event.organizer_type === "profile") {
    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", event.organizer_id)
      .single();

    if (userError) {
      return null;
    }

    organizer = userData;
  } else {
    const { data: tempUserData, error: tempUserError } = await supabase
      .from("temporary_profiles")
      .select("*")
      .eq("id", event.organizer_id)
      .single();

    if (tempUserError) {
      return null;
    }

    type = "temporary_profile";
    organizer = tempUserData;
  }

  const { username, avatar_url } = organizer;
  const {
    data: { publicUrl: organizerPublicUrl },
  } = await supabase.storage.from("avatars").getPublicUrl(avatar_url);

  return (
    <>
      <h1 className="font-semibold text-2xl">Hosted By</h1>
      <div className="flex flex-col space-y-1 items-center">
        <Link
          href={type === "profile" ? `/${username}` : `/${username}?type=t`}
        >
          <Avatar className="h-24 w-24 m-auto">
            <AvatarImage src={organizerPublicUrl} />
            <AvatarFallback />
          </Avatar>
        </Link>
        <span>@{username}</span>
      </div>
    </>
  );
}
