"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { User } from "@supabase/supabase-js";
import { EventDisplayData } from "@/types/event";
import { likeEvent, unlikeEvent } from "@/lib/actions/events";
import { Tables } from "@/types/supabase";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import FilledHeartIcon from "@/components/icons/FilledHeartIcon";
import HeartIcon from "@/components/icons/HeartIcon";
import LoginFlow from "@/app/(login)/login/components/LoginFlow";

/**
 * The LikeButton component allows a user to like or unlike an event.
 * It shows a filled heart icon if the event is liked, and an empty heart icon otherwise.
 */
export default function LikeButton({
  event,
  user,
}: {
  event: EventDisplayData | Tables<"events">;
  user?: User | null;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
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

  const handleLike = async () => {
    if (!user) {
      push(`/login?event=${event.cleaned_name}`);
      return;
    }
    // Optimistically update the UI
    queryClient.setQueryData(["event_liked", event.id], true);
    await likeEvent(event.id, user.id);
    queryClient.invalidateQueries({ queryKey: ["event_liked", event.id] });
  };

  const handleUnlike = async () => {
    if (!user) {
      push(`/login?event=${event.cleaned_name}`);
      return;
    }
    // Optimistically update the UI
    queryClient.setQueryData(["event_liked", event.id], false);
    await unlikeEvent(event.id, user.id);
    queryClient.invalidateQueries({ queryKey: ["event_liked", event.id] });
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

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
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <div className="hover:cursor-pointer">
          <HeartIcon />
        </div>
      </DialogTrigger>
      <DialogContent className="w-80 md:w-96 h-[22rem] pt-10 flex items-center">
        <LoginFlow isDialog={true} closeDialog={closeDialog} />
      </DialogContent>
    </Dialog>
  );
}
