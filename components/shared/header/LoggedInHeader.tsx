import Link from "next/link";
import createSupabaseServerClient from "@/utils/supabase/server";
import TreasureEmerald from "../../icons/TreasureEmerald";
import HamburgerMenu from "./HamburgerMenu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getProfile } from "@/lib/helpers/profiles";
import { User } from "@supabase/supabase-js";

export default async function LoggedInHeader({ user }: { user: User | null }) {
  const supabase = await createSupabaseServerClient();
  const { profile } = await getProfile(user?.id);
  const {
    data: { publicUrl },
  } = await supabase.storage.from("avatars").getPublicUrl(profile.avatar_url);

  return (
    <header className="flex h-16 justify-between items-center max-w-[var(--container-width)] m-auto w-full mb-10">
      <div className="relative">
        <Link
          href="/"
          className="font-bold text-4xl flex items-center space-x-1"
        >
          <TreasureEmerald width={34} height={34} />
          <p>Treasure</p>
        </Link>
        {profile.role === "admin" && (
          <p className="text-primary font-bold absolute bottom-[-18px] right-[-26px]">
            admin
          </p>
        )}
      </div>
      <div className="hidden md:flex items-center space-x-6">
        <Link
          href="/events"
          className="hover:text-foreground/80 transition duration-300 text-lg font-semibold"
        >
          Events
        </Link>
        <Link href={`/${profile.username}`} className="rounded-full">
          <Avatar className="h-16 w-16 border-primary">
            <AvatarImage src={publicUrl} />
            <AvatarFallback>
              {profile.first_name[0]}
              {profile.last_name[0]}
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
      <HamburgerMenu profile={profile} profilePublicUrl={publicUrl} />
    </header>
  );
}
