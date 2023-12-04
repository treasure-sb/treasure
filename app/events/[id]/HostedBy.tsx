import { Tables } from "@/types/supabase";
import createSupabaseServerClient from "@/utils/supabase/server";
import Link from "next/link";
import Image from "next/image";

export default async function HostedBy({ event }: { event: Tables<"events"> }) {
  const supabase = await createSupabaseServerClient();
  const { data: user, error: userError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", event.organizer_id)
    .single();

  // avatar for organizer
  const {
    data: { publicUrl: organizerPublicUrl },
  } = await supabase.storage.from("avatars").getPublicUrl(user.avatar_url);

  return (
    <>
      <h1 className="font-semibold text-2xl">Hosted By</h1>
      <div className="h-40 overflow-hidden justify-end mt-4">
        <Link href={`/users/${user.id}`}>
          <div className="flex flex-col gap-2 text-center">
            <div className="h-28 w-28 rounded-full overflow-hidden m-auto">
              <Image
                className="block w-full h-full object-cover"
                alt="avatar"
                src={organizerPublicUrl}
                width={100}
                height={100}
              />
            </div>
            <p className="text-sm w-auto">@{user.instagram}</p>
          </div>
        </Link>
      </div>
    </>
  );
}
