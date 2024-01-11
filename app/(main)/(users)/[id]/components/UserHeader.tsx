import createSupabaseServerClient from "@/utils/supabase/server";
import Link from "next/link";
import ColorThief from "./ColorThief";
import CopyProfileLink from "./utilities/CopyProfileLink";
import { socialLinkData } from "@/lib/helpers/links";
import { Tables } from "@/types/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getPaymentLinks, getSocialLinks } from "@/lib/actions/links";
import { Settings } from "lucide-react";
import QRCode from "./utilities/QRCode";

export default async function UserHeader({
  user,
  ownProfile = false,
}: {
  user: Tables<"profiles"> | Tables<"temporary_profiles">;
  ownProfile: boolean;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { publicUrl },
  } = await supabase.storage.from("avatars").getPublicUrl(user.avatar_url);

  // determine if user is a profile or a temp profile
  const isProfile = "bio" in user;

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

  const { links: paymentLinks } = await getPaymentLinks(user.id);

  const mobileHeader = (
    <div className="flex flex-col space-y-4 md:hidden relative">
      <div className="text-center md:mt-16">
        {ownProfile && (
          <div className="w-full flex justify-end">
            <Link href="/profile">
              <Settings className="w-8 h-8 hover:cursor-pointer stroke-1 mr-3" />
            </Link>
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
          <div className="relative w-fit m-auto">
            <Avatar className="h-40 w-40 m-auto">
              <AvatarImage src={publicUrl} />
              <AvatarFallback />
            </Avatar>
            <CopyProfileLink username={user.username} />
            {ownProfile && <QRCode username={user.username} />}
          </div>
          {isProfile && (
            <p className="text-center text-sm">
              {(user as Tables<"profiles">).bio}
            </p>
          )}
        </div>
      </div>
      {isProfile && (
        <Link className="m-auto w-[50%]" href={`/pay?vendor=${user.username}`}>
          <Button className="w-full p-6 text-lg font-bold bg-primary">
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
    <div
      className="md:flex md:flex-col md:space-y-6 
    md:text-center md:mt-8 hidden w-[40%] sticky top-0"
    >
      {ownProfile && (
        <div className="w-full flex justify-end">
          <Link href="/profile">
            <Settings className="w-8 h-8 hover:cursor-pointer stroke-1 mr-3" />
          </Link>
        </div>
      )}
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
      <div className="relative w-fit m-auto">
        <Avatar className="h-32 w-32 md:h-52 md:w-52 m-auto">
          <AvatarImage src={publicUrl} />
          <AvatarFallback />
        </Avatar>
        <CopyProfileLink username={user.username} />
        {ownProfile && <QRCode username={user.username} />}
      </div>
      {ownProfile && (
        <p className="text-center">{(user as Tables<"profiles">).bio}</p>
      )}
      <div className="m-auto flex space-x-4 justify-center items-center overflow-scroll scrollbar-hidden">
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
      {isProfile && paymentLinks.length > 0 && (
        <Link className="m-auto w-60" href={`/pay?vendor=${user.username}`}>
          <Button className="w-full p-6 text-lg font-bold bg-primary">
            Pay Now
          </Button>
        </Link>
      )}
      <ColorThief publicUrl={publicUrl} />
    </div>
  );

  return (
    <>
      {desktopHeader}
      {mobileHeader}
    </>
  );
}
