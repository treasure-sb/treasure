import format from "date-fns/format";
import createSupabaseServerClient from "@/utils/supabase/server";
import Link from "next/link";
import InstagramIcon from "@/components/icons/InstagramIcon";
import TwitterIcon from "@/components/icons/TwitterIcon";
import { Tables } from "@/types/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function ProfileHeader({
  user,
}: {
  user: Tables<"profiles">;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { publicUrl },
  } = await supabase.storage.from("avatars").getPublicUrl(user.avatar_url);
  let instaLink = "https://www.instagram.com/" + user.instagram;
  let twitterLink = "https://www.twitter.com/" + user.twitter;

  const formattedJoinedDate = format(new Date(user.created_at), "MMMM, yyyy");
  return (
    <div className="flex flex-col space-y-4 text-center md:mt-16">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">
          {user.first_name} {user.last_name}
        </h1>
      </div>
      <Avatar className="h-32 w-32 md:h-52 md:w-52 m-auto">
        <AvatarImage src={publicUrl} />
        <AvatarFallback>
          {user.first_name[0]}
          {user.last_name[0]}
        </AvatarFallback>
      </Avatar>
      <p>{user.bio}</p>
      <p className="font-semibold bg-gradient-to-r from-primary to bg-green-200 text-transparent bg-clip-text">
        Joined Treasure {formattedJoinedDate}
      </p>
      {user.instagram && (
        <Link
          className="flex text-base space-x-2 justify-center align-middle w-fit m-auto"
          href={instaLink}
        >
          <InstagramIcon />
          <h1>@{user.instagram}</h1>
        </Link>
      )}
      {user.twitter && (
        <Link
          className="flex text-base space-x-2 justify-center align-middle w-fit m-auto"
          href={twitterLink}
        >
          <TwitterIcon />
          <h1>@{user.twitter}</h1>
        </Link>
      )}
    </div>
  );
}
