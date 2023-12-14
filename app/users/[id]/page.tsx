import Image from "next/image";
import createSupabaseServerClient from "@/utils/supabase/server";
import Link from "next/link";
import { Tables } from "@/types/supabase";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import InstagramIcon from "@/components/icons/InstagramIcon";
import TwitterIcon from "@/components/icons/TwitterIcon";

export default async function Page({ params }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient();
  const { data: userData, error: userError } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", params.id)
    .single();

  if (userError) {
    redirect("/events");
  }

  const user: Tables<"profiles"> = userData;

  const {
    data: { publicUrl },
  } = await supabase.storage.from("avatars").getPublicUrl(user.avatar_url);
  let instaLink = "https://www.instagram.com/" + user.instagram;
  let twitterLink = "https://www.twitter.com/" + user.twitter;

  return (
    <main className="m-auto max-w-lg">
      <div className="flex flex-col space-y-6 ">
        <Avatar className="h-32 w-32 m-auto">
          <AvatarImage src={publicUrl} />
          <AvatarFallback>
            {user.first_name[0]}
            {user.last_name[0]}
          </AvatarFallback>
        </Avatar>
        <div className="text-2xl m-auto font-semibold text-center">
          @{user.username}
        </div>
        {user.instagram && (
          <Link
            className="flex text-base space-x-4 justify-center align-middle"
            href={instaLink}
          >
            <InstagramIcon />
            <h1>@{user.instagram}</h1>
          </Link>
        )}
        {user.twitter && (
          <Link
            className="flex text-base space-x-4 justify-center align-middle"
            href={twitterLink}
          >
            <TwitterIcon />
            <h1>@{user.twitter}</h1>
          </Link>
        )}
      </div>
    </main>
  );
}
