import HostCard from "@/app/(event-page)/events/[name]/components/hosts/HostCard";
import { Separator } from "@/components/ui/separator";
import { useCreateEvent } from "../../context/CreateEventContext";
import { Host } from "@/app/(event-page)/events/[name]/components/hosts/HostedBy";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

export default function HostedBy() {
  const { user } = useCreateEvent();
  const { data } = useQuery({
    queryKey: ["avatar"],
    queryFn: async () => {
      if (!user) return { publicUrl: "" };

      const supabase = createClient();
      const { data } = await supabase.storage
        .from("avatars")
        .getPublicUrl(user.avatar_url, {
          transform: {
            width: 200,
            height: 200,
          },
        });

      return data;
    },
    enabled: !!user,
  });

  const host: Host = {
    type: "HOST",
    id: user ? user.id : "",
    role: "Host",
    firstName: user ? user.first_name : "Host",
    lastName: user ? user.last_name : "",
    businessName: user ? user.business_name : "",
    username: user ? user.username : "username",
    publicUrl: data?.publicUrl || "",
  };

  return (
    <>
      <Separator />
      <section>
        <div className="w-full justify-between flex items-center mb-2">
          <h3 className="font-semibold text-lg mb-2">Hosted By</h3>
        </div>
        <div className="pointer-events-none">
          <HostCard host={host} />
        </div>
      </section>
    </>
  );
}
