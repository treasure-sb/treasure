import { Tables } from "@/types/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getSocialLinks } from "@/lib/actions/links";
import { socialLinkData } from "@/lib/helpers/links";
import createSupabaseServerClient from "@/utils/supabase/server";
import Link from "next/link";
import ContactHost from "./ContactHost";
import { ArrowUpRight, InstagramIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { EventWithDates } from "@/types/event";

type OrganizerType = Tables<"profiles"> | Tables<"temporary_profiles">;

export default async function HostedBy({ event }: { event: EventWithDates }) {
  const supabase = await createSupabaseServerClient();
  let organizer: OrganizerType;
  let type = "profile";
  if (event.organizer_type === "profile") {
    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", event.organizer_id)
      .single();

    if (userError) {
      return null;
    }

    organizer = userData;
  } else {
    const { data: tempUserData, error: tempUserError } = await supabase
      .from("temporary_profiles")
      .select("*")
      .eq("id", event.organizer_id)
      .single();

    if (tempUserError) {
      return null;
    }

    type = "temporary_profile";
    organizer = tempUserData;
  }
  const fetchUserLinksData = async () => {
    const { links } = await getSocialLinks(organizer.id);
    const listWithData = links.map((link: Tables<"links">) => {
      return {
        ...link,
        ...socialLinkData[link.application],
      };
    });
    return listWithData;
  };

  const renderLinks = async () => {
    return fetchedLinks.map((link, index) => (
      <Link
        target="_blank"
        key={index}
        href={`${link.url}${link.username}`}
        className=" flex gap-2 items-center justify-center"
      >
        <div className="scale-75">{link.icon}</div>
        <div>@{link.username}</div>
      </Link>
    ));
  };

  const fetchedLinks = await fetchUserLinksData();
  const instagramLink = fetchedLinks.find(
    (link) => link.application === "Instagram"
  );

  let links = await renderLinks();

  const { username, avatar_url } = organizer;
  const {
    data: { publicUrl: organizerPublicUrl },
  } = await supabase.storage.from("avatars").getPublicUrl(avatar_url);

  return (
    <>
      <Separator />
      <section>
        <div className="w-full justify-between flex items-center mb-2">
          <h3 className="font-semibold text-lg mb-2">Hosted By</h3>
          <ContactHost
            organizer={organizer}
            profileType={type}
            renderLinks={links}
          />
        </div>

        <Link
          href={type === "profile" ? `/${username}` : `/${username}?type=t`}
          className="flex space-x-4 items-center border-[1px] rounded-2xl w-full md:w-fit p-4 pr-10 relative group bg-slate-500/5 group-hover:bg-slate-10 hover:bg-slate transition duration-300"
        >
          <Avatar className="h-24 md:h-28 w-24 md:w-28">
            <AvatarImage src={organizerPublicUrl} />
            <AvatarFallback />
          </Avatar>
          {event.organizer_type === "profile" ? (
            <div className="flex flex-col space-y-2">
              <div>
                <p className="font-semibold text-lg md:text-xl">
                  {organizer.business_name
                    ? organizer.business_name
                    : (organizer as Tables<"profiles">).first_name +
                      " " +
                      (organizer as Tables<"profiles">).last_name}
                </p>
                <p className="text-xs text-gray-500">@{username}</p>
              </div>
              {instagramLink && (
                <div className="flex space-x-1">
                  <InstagramIcon className="text-gray-300" />
                  <p className="text-sm md:text-base text-gray-300">
                    @{instagramLink.username}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <div>
                <p className="font-semibold text-xl">
                  {organizer.business_name}
                </p>
                <p className="text-xs text-gray-500">@{username}</p>
              </div>
              {(organizer as Tables<"temporary_profiles">).instagram && (
                <div className="flex space-x-1">
                  <InstagramIcon className="text-gray-300" />
                  <p className="text-gray-300">
                    @{(organizer as Tables<"temporary_profiles">).instagram}
                  </p>
                </div>
              )}
            </div>
          )}
          <ArrowUpRight
            size={18}
            className="stroke-2 absolute right-3 top-3 text-foreground/60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition duration-300 group-hover:text-foreground"
          />
        </Link>
      </section>
    </>
  );
}
