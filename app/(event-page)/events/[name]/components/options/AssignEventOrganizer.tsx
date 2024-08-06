"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { fetchTemporaryProfiles } from "@/lib/helpers/profiles";
import { EventWithDates } from "@/types/event";
import { Tables } from "@/types/supabase";
import { toast } from "sonner";
import AssignEventIcon from "@/components/icons/AssignEventIcon";

type TemporaryHost = Tables<"temporary_profiles"> & {
  temporary_hosts: {
    event_id: string;
  }[];
};

export default function AssignEventOrganizer({
  event,
}: {
  event: EventWithDates;
}) {
  const supabase = createClient();
  const { refresh } = useRouter();
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { data, refetch } = useQuery({
    queryKey: ["profiles", search],
    queryFn: async () => {
      const profiles = await fetchTemporaryProfiles(search);
      return profiles;
    },
    enabled: search.length > 0,
  });

  const tempHosts: TemporaryHost[] = data || [];

  const handleSearch = useDebouncedCallback((term: string) => {
    setSearch(term);
  }, 300);

  const handleAssign = async (profileId: string) => {
    toast.loading("Assigning profile to event");
    const { error } = await supabase.from("temporary_hosts").insert([
      {
        event_id: event.id,
        host_id: profileId,
      },
    ]);

    if (error) {
      toast.dismiss();
      toast.error("Failed to assign profile to event");
      return;
    }

    toast.dismiss();
    toast.success("Profile assigned to event");
    refetch();
    refresh();
  };

  const handleRemove = async (profileId: string) => {
    toast.loading("Removing profile from event");
    const { error } = await supabase
      .from("temporary_hosts")
      .delete()
      .eq("host_id", profileId)
      .eq("event_id", event.id);

    if (error) {
      toast.dismiss();
      toast.error("Failed to remove profile from event");
      return;
    }

    toast.dismiss();
    toast.success("Profile removed from event");
    refetch();
    refresh();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="hover:cursor-pointer opacity-80 sm:opacity-60 hover:opacity-100 transition duration-300">
          <AssignEventIcon />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign event to a temporary profile</DialogTitle>
          <Input
            onChange={(e) => handleSearch(e.target.value)}
            type="text"
            autoComplete="off"
            id="search"
            placeholder="Search Profile"
            className="pl-0"
          />
        </DialogHeader>
        {tempHosts && search.trim().length > 0
          ? tempHosts?.map((profile) => (
              <div
                key={profile.id}
                className="flex justify-between items-center"
              >
                <div className="flex space-x-3 items-center">
                  <Avatar className="h-14 w-14">
                    <AvatarFallback />
                    <AvatarImage src={profile.avatar_url} />
                  </Avatar>
                  <div>
                    <p className="text-lg font-semibold">
                      {profile.business_name}
                    </p>
                    <p className="text-sm text-gray-400">@{profile.username}</p>
                  </div>
                </div>
                {profile.temporary_hosts
                  .map((event) => event.event_id)
                  .includes(event.id) ? (
                  <Button
                    className="rounded-sm"
                    variant={"destructive"}
                    onClick={() => handleRemove(profile.id)}
                  >
                    Remove
                  </Button>
                ) : (
                  <Button
                    className="rounded-sm"
                    onClick={() => handleAssign(profile.id)}
                  >
                    Assign
                  </Button>
                )}
              </div>
            ))
          : null}
      </DialogContent>
    </Dialog>
  );
}
