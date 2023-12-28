import format from "date-fns/format";
import createSupabaseServerClient from "@/utils/supabase/server";
import Link from "next/link";
import InstagramIcon from "@/components/icons/InstagramIcon";
import TwitterIcon from "@/components/icons/TwitterIcon";
import { Tables } from "@/types/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default async function UserHeader({ user }: { user: any }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { publicUrl },
  } = await supabase.storage.from("avatars").getPublicUrl(user.avatar_url);
  let instaLink = "https://www.instagram.com/" + user.instagram;
  let twitterLink = "https://www.twitter.com/" + user.twitter;
  const formattedJoinedDate = format(new Date(user.created_at), "MMMM yyyy");

  let hasPayments = false;
  if (user.venmo || user.zelle || user.cashapp || user.paypal) {
    hasPayments = true;
  }

  const mobileHeader = (
    <div className="flex flex-col space-y-6 md:hidden">
      <div className="flex items-center text-center md:mt-16">
        <div className="space-y-4">
          <Avatar className="h-28 w-28 m-auto">
            <AvatarImage src={publicUrl} />
            <AvatarFallback>
              {user.first_name[0]}
              {user.last_name[0]}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-md font-bold">
            {user.first_name} {user.last_name}
          </h1>
        </div>
        <div className="w-full space-y-4">
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
      </div>
      <p className="text-center">{user.bio}</p>
      {hasPayments && (
        <Link className="m-auto w-[50%]" href={`/pay?vendor=${user.username}`}>
          <Button className="w-full">Pay Now</Button>
        </Link>
      )}
    </div>
  );

  const desktopHeader = (
    <div className="md:flex md:flex-col md:space-y-6 md:text-center md:mt-16 hidden">
      <h1 className="text-2xl md:text-3xl font-bold">
        {user.first_name} {user.last_name}
      </h1>
      <Avatar className="h-32 w-32 md:h-52 md:w-52 m-auto">
        <AvatarImage src={publicUrl} />
        <AvatarFallback>
          {user.first_name[0]}
          {user.last_name[0]}
        </AvatarFallback>
      </Avatar>
      <p>{user.bio}</p>
      <div className="space-y-1">
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
      {hasPayments && (
        <Link className="m-auto w-full" href={`/pay?vendor=${user.username}`}>
          <Button className="w-full">Pay Now</Button>
        </Link>
      )}

      <p className="font-semibold bg-gradient-to-r hidden md:block from-primary to bg-green-200 text-transparent bg-clip-text">
        Joined Treasure {formattedJoinedDate}
      </p>
    </div>
  );

  return (
    <>
      {desktopHeader}
      {mobileHeader}
    </>
  );
}
