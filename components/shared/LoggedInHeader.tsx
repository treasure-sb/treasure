import Link from "next/link";
import createSupabaseServerClient from "@/utils/supabase/server";
import TreasureEmerald from "../icons/TreasureEmerald";
import { validateUser } from "@/lib/actions/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function LoggedInHeader() {
  const {
    data: { user },
  } = await validateUser();

  const supabase = await createSupabaseServerClient();
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  const {
    data: { publicUrl },
  } = await supabase.storage.from("avatars").getPublicUrl(profile.avatar_url);

  return (
    <header className="flex justify-between md:max-w-6xl xl:max-w-7xl m-auto w-full mb-10 items-center">
      <div className="relative">
        <Link
          href="/"
          className="font-semibold text-3xl flex items-center space-x-1"
        >
          <TreasureEmerald width={34} height={34} />
          <h1>Treasure</h1>
        </Link>
        {profile.role === "admin" && (
          <p className="text-primary font-bold absolute bottom-[-14px] right-[-26px]">
            admin
          </p>
        )}
      </div>
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
