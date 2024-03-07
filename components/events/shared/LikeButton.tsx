"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { User } from "@supabase/supabase-js";
import { EventDisplayData } from "@/types/event";
import { likeEvent, unlikeEvent } from "@/lib/actions/events";
import { Tables } from "@/types/supabase";
import FilledHeartIcon from "@/components/icons/FilledHeartIcon";
import HeartIcon from "@/components/icons/HeartIcon";
import LoginFlowDialog from "@/components/ui/custom/login-flow-dialog";

export default function LikeButton({
  event,
  user,
}: {
  event: EventDisplayData | Tables<"events">;
  user?: User | null;
}) {
  const queryClient = useQueryClient();
  const { push } = useRouter();
  const { data } = useQuery({
    queryKey: ["event_liked", event.id],
    queryFn: async () => {
      if (!user) return false;
      const supabase = createClient();
      const { data: likedEvents } = await supabase
        .from("event_likes")
        .select("user_id")
        .eq("event_id", event.id)
        .eq("user_id", user.id);
      return likedEvents && likedEvents.length > 0;
    },
    enabled: !!user,
  });

  const handleOptimisticUpdate = (liked: boolean) => {
    queryClient.setQueryData(["event_liked", event.id], liked);
  };

  const handleLike = async () => {
    if (!user) {
      push(`/login?event=${event.cleaned_name}`);
      return;
    }

    handleOptimisticUpdate(true);
    await likeEvent(event.id, user.id);
    queryClient.invalidateQueries({ queryKey: ["event_liked", event.id] });
  };

  const handleUnlike = async () => {
    if (!user) {
      push(`/login?event=${event.cleaned_name}`);
      return;
    }

    handleOptimisticUpdate(false);
    await unlikeEvent(event.id, user.id);
    queryClient.invalidateQueries({ queryKey: ["event_liked", event.id] });
  };

  const loginDialogTrigger = (
    <div className="hover:cursor-pointer">
      <HeartIcon />
    </div>
  );

  return data ? (
    <div
      onClick={async () => await handleUnlike()}
      className="flex-shrink-0 hover:cursor-pointer"
    >
      <FilledHeartIcon />
    </div>
  ) : user ? (
    <div
      onClick={async () => await handleLike()}
      className="flex-shrink-0 hover:cursor-pointer"
    >
      <HeartIcon />
    </div>
  ) : (
    <LoginFlowDialog trigger={loginDialogTrigger} />
  );
}
