import { EventDisplayData } from "@/types/event";
import { redirect } from "next/navigation";
import createSupabaseServerClient from "@/utils/supabase/server";
import MemberCard from "./MemberCard";
import { Database } from "@/types/supabase";
import { validateUser } from "@/lib/actions/auth";

type TeamMemberSupabase = {
  role: string;
  status: string;
  user_id: string;
  profile: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    avatar_url: string;
  };
};

export type TeamMember = {
  userId: string;
  role: RoleMapKey;
  status: StatusKey;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  publicProfileUrl: string;
};

export type RoleMapKey = Database["public"]["Enums"]["Event Roles"];
export type StatusKey = Database["public"]["Enums"]["Event Role Status"];

const createTeamMember = async (
  member: TeamMemberSupabase
): Promise<TeamMember> => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { publicUrl },
  } = await supabase.storage
    .from("avatars")
    .getPublicUrl(member.profile.avatar_url, {
      transform: {
        width: 200,
        height: 200,
      },
    });

  return {
    userId: member.user_id,
    role: member.role as RoleMapKey,
    status: member.status as StatusKey,
    firstName: member.profile.first_name,
    lastName: member.profile.last_name,
    email: member.profile.email,
    phone: member.profile.phone,
    publicProfileUrl: publicUrl,
  };
};

export default async function ListMembers({
  event,
}: {
  event: EventDisplayData;
}) {
  const supabase = await createSupabaseServerClient();
  const { data: teamData, error } = await supabase
    .from("event_roles")
    .select(
      "role, status, user_id, profile:profiles(first_name, last_name, email, phone, avatar_url)"
    )
    .eq("event_id", event.id)
    .returns<TeamMemberSupabase[]>();

  if (error) {
    console.error(error);
    redirect("/host");
  }

  const {
    data: { user },
  } = await validateUser();

  const loggedInUser = user!;
  const teamMembersPromise = teamData.map(createTeamMember);
  const teamMembers = await Promise.all(teamMembersPromise);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4">
      {teamMembers.map((member) => (
        <MemberCard key={member.email} member={member} user={loggedInUser} />
      ))}
    </div>
  );
}
