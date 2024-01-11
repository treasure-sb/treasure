"use client";
import { fetchTemporaryProfiles } from "@/lib/helpers/profiles";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import InviteLink from "./components/InviteLink";

export default function Assign() {
  const [search, setSearch] = useState("");
  const { data } = useQuery({
    queryKey: ["profiles", search],
    queryFn: async () => {
      const profiles = await fetchTemporaryProfiles(search);
      return profiles;
    },
    enabled: search.length > 0,
  });

  const handleSearch = useDebouncedCallback((term: string) => {
    setSearch(term);
  }, 300);

  return (
    <main className="m-auto max-w-lg">
      <h1 className="font-bold text-2xl w-full mb-10 text-center">
        Assign User to Temporary Profile
      </h1>
      <Input
        onChange={(e) => handleSearch(e.target.value)}
        type="text"
        autoComplete="off"
        id="search"
        placeholder="Search Profile"
        className="pl-0"
      />
      <div className="mt-6 space-y-4">
        {data && search.trim().length > 0
          ? data?.map((profile) => (
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
                <InviteLink temporary_profile_id={profile.id} />
              </div>
            ))
          : null}
      </div>
    </main>
  );
}
