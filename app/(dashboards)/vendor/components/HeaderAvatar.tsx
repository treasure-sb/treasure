import MobileHeaderOptions from "./MobileHeaderOptions";
import Link from "next/link";
import { useStore } from "../store";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getProfile } from "@/lib/helpers/profiles";

export default function HeaderAvatar() {
  const { user } = useStore();
  const { data } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const supabase = createClient();
      const { profile } = await getProfile(user?.id);
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from("avatars")
        .getPublicUrl(profile.avatar_url);
      return { profile, publicUrl };
    },
    enabled: !!user,
  });

  const { profile, publicUrl } = data ?? {};
  return profile ? (
    <Link href={`/${profile?.username}`}>
      {profile?.avatar_url && (
        <Avatar className="h-14 w-14">
          <AvatarImage src={publicUrl} />
          <AvatarFallback>
            {profile.first_name[0]}
            {profile.last_name[0]}
          </AvatarFallback>
        </Avatar>
      )}
    </Link>
  ) : (
    <Avatar className="h-14 w-14">
      <AvatarFallback />
    </Avatar>
  );
}
