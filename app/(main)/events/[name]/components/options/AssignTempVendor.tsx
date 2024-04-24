"use client";

import { Tables } from "@/types/supabase";
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
import { fetchTemporaryVendors } from "@/lib/helpers/profiles";
import { LucideUserPlus2 } from "lucide-react";
import { toast } from "sonner";

type TemporaryVendor = Tables<"temporary_profiles"> & {
  temporary_vendors: {
    event_id: string;
  }[];
};

export default function AssignTempVendor({
  event,
}: {
  event: Tables<"events">;
}) {
  const supabase = createClient();
  const { refresh } = useRouter();
  const [search, setSearch] = useState("");

  const { data, refetch } = useQuery({
    queryKey: ["profiles", search],
    queryFn: async () => {
      const profiles = await fetchTemporaryVendors(search);
      return profiles;
    },
    enabled: search.length > 0,
  });

  const temporaryVendors: TemporaryVendor[] = data || [];

  const handleSearch = useDebouncedCallback((term: string) => {
    setSearch(term);
  }, 300);

  const handleAddVendor = async (profileId: string) => {
    const { error } = await supabase
      .from("temporary_vendors")
      .insert([{ vendor_id: profileId, event_id: event.id }]);

    if (error) {
      toast.error("Error adding vendor");
      return;
    }
    refetch();
    refresh();
  };

  const handleRemoveVendor = async (profileId: string) => {
    const { error } = await supabase
      .from("temporary_vendors")
      .delete()
      .eq("event_id", event.id)
      .eq("vendor_id", profileId);

    if (error) {
      toast.error("Error removing vendor");
      return;
    }
    refetch();
    refresh();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="hover:cursor-pointer opacity-80 sm:opacity-60 hover:opacity-100 transition duration-300">
          <LucideUserPlus2 size={50} className="stroke-1 mx-auto" />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add temporary vendor</DialogTitle>
          <Input
            onChange={(e) => handleSearch(e.target.value)}
            type="text"
            autoComplete="off"
            id="search"
            placeholder="Search Profile"
            className="pl-0"
          />
        </DialogHeader>
        {data &&
          search.trim().length > 0 &&
          temporaryVendors.map((profile) => (
            <div key={profile.id} className="flex justify-between items-center">
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
              {profile.temporary_vendors
                .map((event) => event.event_id)
                .includes(event.id) ? (
                <Button
                  variant={"destructive"}
                  onClick={() => handleRemoveVendor(profile.id)}
                >
                  Remove
                </Button>
              ) : (
                <Button onClick={() => handleAddVendor(profile.id)}>Add</Button>
              )}
            </div>
          ))}
      </DialogContent>
    </Dialog>
  );
}
