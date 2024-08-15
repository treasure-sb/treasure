import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfile } from "../query";

export default function HeaderAvatar() {
  const { profile, publicUrl } = useProfile();

  return profile ? (
    <Link href={`/u/${profile?.username}`}>
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
