import { Tables } from "@/types/supabase";
import { Separator } from "@/components/ui/separator";
import createSupabaseServerClient from "@/utils/supabase/server";
import HostCard from "./HostCard";

type ProfileHost = {
  role: string;
  profile: Tables<"profiles">;
};

export type Host = {
  role: string;
  profile: Tables<"profiles">;
  publicUrl: string;
};

const createOrganizer = async (organizer: ProfileHost) => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { publicUrl },
  } = await supabase.storage
    .from("avatars")
    .getPublicUrl(organizer.profile.avatar_url, {
      transform: {
        width: 200,
        height: 200,
      },
    });

  const { profile, role } = organizer;
  return {
    role,
    profile,
    publicUrl: publicUrl,
  };
};

export default async function HostedBy({ event }: { event: Tables<"events"> }) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("event_roles")
    .select("role, profile:profiles(*)")
    .eq("event_id", event.id)
    .eq("status", "ACTIVE")
    .in("role", ["HOST", "COHOST"])
    .returns<ProfileHost[]>();

  const hosts = await Promise.all(data?.map(createOrganizer) || []);

  return (
    <>
      <Separator />
      <section>
        <div className="w-full justify-between flex items-center mb-2">
          <h3 className="font-semibold text-lg mb-2">Hosted By</h3>
        </div>
        <div className="flex flex-col space-y-2">
          {hosts.map((host) => (
            <HostCard key={host.profile.id} host={host} />
          ))}
        </div>
      </section>
    </>
  );
}
