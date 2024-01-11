import MobileNavBar from "./MobileNavBar";
import createSupabaseServerClient from "@/utils/supabase/server";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getProfile } from "@/lib/helpers/profiles";
import { User } from "@supabase/supabase-js";

export default async function MobileHeader({ user }: { user: User | null }) {
  const supabase = await createSupabaseServerClient();
  const { profile } = await getProfile(user?.id);
  const {
    data: { publicUrl },
  } = await supabase.storage.from("avatars").getPublicUrl(profile.avatar_url);
  return (
    <div className="flex justify-between items-center">
      <MobileNavBar />
      <Link href={`/${profile.username}`}>
        {profile.avatar_url && (
          <Avatar className="h-14 w-14">
            <AvatarImage src={publicUrl} />
            <AvatarFallback>
              {profile.first_name[0]}
              {profile.last_name[0]}
            </AvatarFallback>
          </Avatar>
        )}
      </Link>
    </div>
  );
}
