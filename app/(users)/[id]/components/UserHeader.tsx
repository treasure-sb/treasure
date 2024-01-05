import format from "date-fns/format";
import createSupabaseServerClient from "@/utils/supabase/server";
import Link from "next/link";
import { socialLinkData } from "@/lib/helpers/links";
import { Tables } from "@/types/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getSocialLinks } from "@/lib/actions/links";
import { validateUser } from "@/lib/actions/auth";
import ProfileOptions from "./ProfileOptions";
import ColorThief from "./ColorThief";

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
  const isProfile = "bio" in user;

  // determine if logged in user is viewing their own profile
  const {
    data: { user: loggedInUser },
  } = await validateUser();
  const ownProfile = loggedInUser && loggedInUser.id === user.id;

  const fetchUserLinksData = async () => {
    const { links } = await getSocialLinks(user.id);
    const listWithData = links.map((link: Tables<"links">) => {
      return {
        ...link,
        ...socialLinkData[link.application],
      };
    });
    return listWithData;
  };

  const renderLinks = async () => {
    const fetchedLinks = await fetchUserLinksData();
    return fetchedLinks.map((link, index) => (
      <Link
        target="_blank"
        key={index}
        href={`${link.url}${link.username}`}
        className="border-[1px] w-12 h-12 rounded-full flex items-center justify-center border-white"
      >
        <div className="scale-75">{link.icon}</div>
      </Link>
    ));
  };

  const mobileHeader = (
    <div className="flex flex-col space-y-4 md:hidden relative">
      <div className="text-center md:mt-16">
        {ownProfile && (
          <div className="w-full flex justify-end">
            <ProfileOptions />
          </div>
        )}
        <div className="space-y-4 m-auto">
          <h1 className="text-2xl font-bold">
            {isProfile ? (
              <>
                {(user as Tables<"profiles">).first_name}{" "}
                {(user as Tables<"profiles">).last_name}
              </>
            ) : (
              <>{(user as Tables<"temporary_profiles">).business_name}</>
            )}
          </h1>
          <Avatar className="h-40 w-40 m-auto">
            <AvatarImage src={publicUrl} />
            <AvatarFallback />
          </Avatar>
          {isProfile && (
            <p className="text-center text-sm">
              {(user as Tables<"profiles">).bio}
            </p>
          )}
        </div>
      </div>
      {isProfile && (
        <Link className="m-auto w-[50%]" href={`/pay?vendor=${user.username}`}>
          <Button className="w-full p-6 text-lg font-bold bg-tertiary hover:bg-tertiary/80">
            Pay Now
          </Button>
        </Link>
      )}
      <div className="m-auto flex space-x-10 justify-center items-center overflow-scroll scrollbar-hidden">
        {isProfile
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
      <ColorThief publicUrl={publicUrl} />
    </div>
  );

  const desktopHeader = (
    <div className="md:flex md:flex-col md:space-y-6 md:text-center md:mt-16 hidden">
      <h1 className="text-2xl md:text-3xl font-bold">
        {isProfile ? (
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
      {isProfile && (
        <p className="text-center">{(user as Tables<"profiles">).bio}</p>
      )}
      <div className="space-y-1">
        {isProfile
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
      {isProfile && (
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
