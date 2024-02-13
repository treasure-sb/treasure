import Link from "next/link";
import createSupabaseServerClient from "@/utils/supabase/server";
import TreasureEmerald from "../icons/TreasureEmerald";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getProfile } from "@/lib/helpers/profiles";
import { User } from "@supabase/supabase-js";

export default async function LoggedInHeader({ user }: { user: User | null }) {
  const supabase = await createSupabaseServerClient();
  const { profile } = await getProfile(user?.id);
  const {
    data: { publicUrl },
  } = await supabase.storage.from("avatars").getPublicUrl(profile.avatar_url);

  return (
    <header className="flex justify-between md:max-w-6xl xl:max-w-7xl m-auto w-full mb-10 items-center z-10">
      <div className="relative scale-90 -translate-x-4 sm:scale-100 sm:translate-x-0">
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
      <div className="flex align-middle">
        <Link
          href="/events"
          className="my-auto font-semibold mr-6 text-lg relative group"
        >
          <span className="text-foreground/70 hover:text-foreground transition duration-300">
            Events
          </span>
        </Link>
        <Link
          href="/faq"
          className="my-auto font-semibold mr-6 text-lg relative group"
        >
          <span className="text-foreground/70 hover:text-foreground transition duration-300">
            FAQ
          </span>
        </Link>
        <Link href={`/${profile.username}`}>
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
      </div>
    </header>
  );
}
