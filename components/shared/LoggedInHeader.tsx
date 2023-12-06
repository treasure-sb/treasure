import Link from "next/link";
import createSupabaseServerClient from "@/utils/supabase/server";
import { validateUser } from "@/lib/actions/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function LoggedInHeader() {
  const { data } = await validateUser();
  const user = data.user;

  const supabase = await createSupabaseServerClient();
  const { data: profile, error: fghfgh } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  const {
    data: { publicUrl },
  } = await supabase.storage.from("avatars").getPublicUrl(profile.avatar_url);

  return (
    <header className="flex justify-between md:max-w-6xl xl:max-w-7xl m-auto w-full mb-10 items-center">
      <Link href="/" className="font-bold text-3xl">
        Treasure
      </Link>
      <Link href="/profile">
        {profile.avatar_url ? (
          <Avatar className="h-14 w-14">
            <AvatarImage src={publicUrl} />
            <AvatarFallback>
              {profile.first_name[0]}
              {profile.last_name[0]}
            </AvatarFallback>
          </Avatar>
        ) : (
          <h1>My Profile</h1>
        )}
      </Link>
    </header>
  );
}
