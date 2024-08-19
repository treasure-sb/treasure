import createSupabaseServerClient from "@/utils/supabase/server";
import Link from "next/link";
import ColorThief from "./ColorThief";
import CopyProfileLink from "./utilities/CopyProfileLink";
import QRCode from "./utilities/QRCode";
import { socialLinkData } from "@/lib/helpers/links";
import { Tables } from "@/types/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getPaymentLinks, getSocialLinks } from "@/lib/actions/links";
import { Settings } from "lucide-react";

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
        <div className="space-y-4 m-auto">
          <h1 className="text-2xl font-bold">
            {isProfile ? (
              <>
                {user.business_name ? (
                  <>{(user as Tables<"profiles">).business_name}</>
                ) : (
                  <>
                    {(user as Tables<"profiles">).first_name}{" "}
                    {(user as Tables<"profiles">).last_name}
                  </>
                )}
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
            {ownProfile && (
              <Link
                href="/profile"
                className="absolute top-1 right-1 w-11 h-11 flex items-center justify-center rounded-full bg-foreground border-2 hover:cursor-pointer hover:bg-tertiary transition duration-500 focus:outline-none"
              >
                <Settings className="w-7 h-7 m-auto text-background" />
              </Link>
            )}
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
      {isProfile && paymentLinks.length > 0 && (
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
                target="_blank"
                href={`https://www.instagram.com/${
                  (user as Tables<"temporary_profiles">).instagram
                }`}
                className="border-[1px] w-12 h-12 rounded-full flex items-center justify-center border-white"
              >
                <div className="scale-75">
                  {socialLinkData["Instagram"].icon}
                </div>
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
      <h1 className="text-2xl md:text-3xl font-bold">
        {isProfile ? (
          <>
            {user.business_name ? (
              <>{(user as Tables<"profiles">).business_name}</>
            ) : (
              <>
                {(user as Tables<"profiles">).first_name}{" "}
                {(user as Tables<"profiles">).last_name}
              </>
            )}
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
        {ownProfile && (
          <Link
            href="/profile"
            className="absolute top-1 right-1 w-11 h-11 p-2 rounded-full bg-background dark:bg-foreground border-2 border-foreground dark:border-background hover:cursor-pointer transition duration-500"
          >
            <Settings className="w-6 h-6 m-auto text-foreground dark:text-background" />
          </Link>
        )}
        <CopyProfileLink username={user.username} />
        {ownProfile && <QRCode username={user.username} />}
      </div>
      {isProfile && (
        <p className="text-center">{(user as Tables<"profiles">).bio}</p>
      )}
      <div className="m-auto flex space-x-4 justify-center items-center overflow-scroll scrollbar-hidden">
        {isProfile
          ? await renderLinks()
          : (user as Tables<"temporary_profiles">).instagram && (
              <Link
                target="_blank"
                href={`https://www.instagram.com/${
                  (user as Tables<"temporary_profiles">).instagram
                }`}
                className="border-[1px] w-12 h-12 rounded-full flex items-center justify-center border-white"
              >
                <div className="scale-75">
                  {socialLinkData["Instagram"].icon}
                </div>
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
