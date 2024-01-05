import format from "date-fns/format";
import createSupabaseServerClient from "@/utils/supabase/server";
import Link from "next/link";
import InstagramIcon from "@/components/icons/applications/InstagramIcon";
import TwitterIcon from "@/components/icons/applications/TwitterIcon";
import { getProfileLinks } from "@/lib/helpers/profiles";
import { Tables } from "@/types/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default async function UserHeader({
  user,
}: {
  user: Tables<"profiles"> | Tables<"temporary_profiles">;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { publicUrl },
  } = await supabase.storage.from("avatars").getPublicUrl(user.avatar_url);
  const formattedJoinedDate = format(new Date(user.created_at), "MMMM yyyy");

  // determine if user is a profile or a temp profile
  const isProfile = () => "bio" in user;

  const fetchUserLinks = async () => {
    const { links } = await getProfileLinks(user.id);
    const filteredLinks = links.filter((link) => link.type === "social");
    const listLinks = filteredLinks.map((link: Tables<"links">) => {
      if (link.application === "Instagram") {
        return {
          url: "https://www.instagram.com/" + link.username,
          icon: <InstagramIcon />,
          username: link.username,
        };
      } else if (link.application === "Twitter") {
        return {
          url: "https://www.twitter.com/" + link.username,
          icon: <TwitterIcon />,
          username: link.username,
        };
      } else {
        return {
          url: link.username,
          icon: <></>,
          username: link.username,
        };
      }
    });
    return listLinks;
  };

  const renderLinks = async () => {
    const fetchedLinks = await fetchUserLinks();
    return fetchedLinks.map((link, index) => (
      <Link
        key={index}
        href={link.url}
        className="flex text-base space-x-1 justify-center align-middle w-fit m-auto"
      >
        <div className="scale-75">{link.icon}</div>
        <h1 className="my-auto">@{link.username}</h1>
      </Link>
    ));
  };

  const mobileHeader = (
    <div className="flex flex-col space-y-6 md:hidden">
      <div className="flex items-center text-center md:mt-16">
        <div className="space-y-4">
          <Avatar className="h-28 w-28 m-auto">
            <AvatarImage src={publicUrl} />
            <AvatarFallback />
          </Avatar>
          <h1 className="text-md font-bold">
            {isProfile() ? (
              <>
                {(user as Tables<"profiles">).first_name}{" "}
                {(user as Tables<"profiles">).last_name}
              </>
            ) : (
              <>{(user as Tables<"temporary_profiles">).business_name}</>
            )}
          </h1>
        </div>
        <div className="w-full space-y-4">
          {isProfile()
            ? await renderLinks()
            : (user as Tables<"temporary_profiles">).instagram && (
                <Link
                  href={`https://www.instagram.com/${
                    (user as Tables<"temporary_profiles">).instagram
                  }`}
                >
                  <h1>@{(user as Tables<"temporary_profiles">).instagram}</h1>
                </Link>
              )}
        </div>
      </div>
      {isProfile() && (
        <p className="text-center">{(user as Tables<"profiles">).bio}</p>
      )}
      {isProfile() && (
        <Link className="m-auto w-full" href={`/pay?vendor=${user.username}`}>
          <Button className="w-full">Pay Now</Button>
        </Link>
      )}
    </div>
  );

  const desktopHeader = (
    <div className="md:flex md:flex-col md:space-y-6 md:text-center md:mt-16 hidden">
      <h1 className="text-2xl md:text-3xl font-bold">
        {isProfile() ? (
          <>
            {(user as Tables<"profiles">).first_name}{" "}
            {(user as Tables<"profiles">).last_name}
          </>
        ) : (
          <>{(user as Tables<"temporary_profiles">).business_name}</>
        )}
      </h1>
      <Avatar className="h-32 w-32 md:h-52 md:w-52 m-auto">
        <AvatarImage src={publicUrl} />
        <AvatarFallback />
      </Avatar>
      {isProfile() && (
        <p className="text-center">{(user as Tables<"profiles">).bio}</p>
      )}
      <div className="space-y-1">
        {isProfile()
          ? await renderLinks()
          : (user as Tables<"temporary_profiles">).instagram && (
              <Link
                href={`https://www.instagram.com/${
                  (user as Tables<"temporary_profiles">).instagram
                }`}
              >
                <h1>@{(user as Tables<"temporary_profiles">).instagram}</h1>
              </Link>
            )}
      </div>
      {isProfile() && (
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
