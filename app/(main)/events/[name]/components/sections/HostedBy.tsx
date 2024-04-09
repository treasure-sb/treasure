import { Tables } from "@/types/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import createSupabaseServerClient from "@/utils/supabase/server";
import Link from "next/link";
import ContactHost from "./ContactHost";
import { getSocialLinks } from "@/lib/actions/links";
import { socialLinkData } from "@/lib/helpers/links";

type OrganizerType = Tables<"profiles"> | Tables<"temporary_profiles">;

export default async function HostedBy({ event }: { event: Tables<"events"> }) {
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
    const fetchedLinks = await fetchUserLinksData();
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

  let links = await renderLinks();

  const { username, avatar_url } = organizer;
  const {
    data: { publicUrl: organizerPublicUrl },
  } = await supabase.storage.from("avatars").getPublicUrl(avatar_url);

  return (
    <section className="flex flex-col">
      <div className="w-full justify-between flex">
        <h3 className="font-semibold text-xl mb-4">Hosted By</h3>
        <ContactHost
          organizer={organizer}
          profileType={type}
          renderLinks={links}
        />
      </div>

      <div className="flex flex-col space-y-1 items-center">
        <Link
          href={type === "profile" ? `/${username}` : `/${username}?type=t`}
        >
          <Avatar className="h-24 w-24 m-auto">
            <AvatarImage src={organizerPublicUrl} />
            <AvatarFallback />
          </Avatar>
        </Link>
        {event.organizer_type === "profile" ? (
          <div className="items-center text-center">
            <div className="font-semibold text-base">
              {organizer.business_name
                ? organizer.business_name
                : (organizer as Tables<"profiles">).first_name +
                  " " +
                  (organizer as Tables<"profiles">).last_name}
            </div>
            <div className="text-sm ">@{username}</div>
          </div>
        ) : (
          <div className="items-center text-center">
            <div className="font-semibold text-base">
              {organizer.business_name}
            </div>
            <div className="text-sm ">@{username}</div>
          </div>
        )}
      </div>
    </section>
  );
}
