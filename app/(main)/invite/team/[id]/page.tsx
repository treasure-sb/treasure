import { RoleMapKey } from "@/app/(dashboards)/host/events/[name]/(tools)/team/components/ListMembers";
import { roleMap } from "@/app/(dashboards)/host/events/[name]/(tools)/team/components/MemberCard";
import { getEventDisplayData } from "@/lib/helpers/events";
import { redirect } from "next/navigation";
import { EventWithDates } from "@/types/event";
import { validateUser } from "@/lib/actions/auth";
import createSupabaseServerClient from "@/utils/supabase/server";
import EventDisplay from "@/components/events/shared/EventDisplay";
import ConfirmButton from "./ConfirmButton";

type Profile = {
  id: string;
  first_name: string;
  last_name: string;
};

type InviteTokenData = {
  role: RoleMapKey;
  event: EventWithDates;
  profile: Profile;
};

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const {
    data: { user },
  } = await validateUser();

  if (!user) {
    redirect(`/login?redirect=/invite/team/${id}`);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("event_roles_invite_tokens")
    .select(
      "role, event:events(*, dates:event_dates(date, start_time, end_time)), profile:profiles(id, first_name, last_name)"
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    redirect("/home");
  }

  const inviteTokenData: InviteTokenData = {
    role: data.role,
    event: data.event as unknown as EventWithDates,
    profile: data.profile as unknown as Profile,
  };

  if (inviteTokenData.profile.id !== user.id) {
    redirect("/home");
  }

  const eventDisplay = await getEventDisplayData(inviteTokenData.event);

  return (
    <div className="mx-auto max-w-lg flex flex-col items-center justify-center p-4 space-y-6">
      <div className="text-left">
        <h1 className="text-xl">
          You've been invited join the {roleMap[inviteTokenData.role]} team at{" "}
          {eventDisplay.name}
        </h1>
        <p className="text-sm text-muted-foreground">
          Please confirm your role by clicking the button below. You'll then
          have access to the event in your host dashboard.
        </p>
      </div>
      <div className="w-full">
        <EventDisplay
          event={eventDisplay}
          showLikeButton={false}
          showTicket={false}
        />
      </div>
      <ConfirmButton
        tokenID={id}
        eventID={eventDisplay.id}
        memberID={inviteTokenData.profile.id}
      />
    </div>
  );
}
