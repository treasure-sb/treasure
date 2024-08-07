import { Tables } from "@/types/supabase";
import { Separator } from "@/components/ui/separator";
import createSupabaseServerClient from "@/utils/supabase/server";
import HostCard from "./HostCard";

type ProfileHost = {
  role: string;
  profile: Tables<"profiles">;
};

type TemporaryHost = {
  profile: Tables<"temporary_profiles">;
};

export type Host = {
  id: string;
  role: string;
  firstName: string | null;
  lastName: string | null;
  businessName: string | null;
  username: string;
  publicUrl: string;
};

const createHost = async (host: ProfileHost): Promise<Host> => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { publicUrl },
  } = await supabase.storage
    .from("avatars")
    .getPublicUrl(host.profile.avatar_url, {
      transform: {
        width: 200,
        height: 200,
      },
    });

  const { profile, role } = host;
  return {
    id: profile.id,
    role,
    firstName: profile.first_name,
    lastName: profile.last_name,
    businessName: profile.business_name,
    username: profile.username,
    publicUrl: publicUrl,
  };
};

const createHostFromTemp = async (host: TemporaryHost): Promise<Host> => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { publicUrl },
  } = await supabase.storage
    .from("avatars")
    .getPublicUrl(host.profile.avatar_url, {
      transform: {
        width: 200,
        height: 200,
      },
    });

  const { profile } = host;
  return {
    id: profile.id,
    role: "HOST",
    firstName: null,
    lastName: null,
    businessName: profile.business_name,
    username: profile.username,
    publicUrl: publicUrl,
  };
};

export default async function HostedBy({ event }: { event: Tables<"events"> }) {
  const supabase = await createSupabaseServerClient();
  const { data: hostData } = await supabase
    .from("event_roles")
    .select("role, profile:profiles(*)")
    .eq("event_id", event.id)
    .eq("status", "ACTIVE")
    .in("role", ["HOST", "COHOST"])
    .returns<ProfileHost[]>();

  const { data: tempHostData } = await supabase
    .from("temporary_hosts")
    .select("profile:temporary_profiles(*)")
    .eq("event_id", event.id)
    .returns<TemporaryHost[]>();

  const temporaryHosts = await Promise.all(
    tempHostData?.map(createHostFromTemp) || []
  );
  const hosts = await Promise.all(hostData?.map(createHost) || []);

  const showTempHosts = hosts.length === 0;

  return (
    <>
      <Separator />
      <section>
        <div className="w-full justify-between flex items-center mb-2">
          <h3 className="font-semibold text-lg mb-2">Hosted By</h3>
        </div>
        <div className="flex flex-col space-y-2">
          {showTempHosts
            ? temporaryHosts.map((host) => (
                <HostCard key={host.id} host={host} />
              ))
            : hosts.map((host) => <HostCard key={host.id} host={host} />)}
        </div>
      </section>
    </>
  );
}
