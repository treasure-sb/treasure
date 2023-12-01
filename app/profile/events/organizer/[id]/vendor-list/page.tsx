"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import Image from "next/image";

export default function Page({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const [vendors, setVendors] = useState<any[]>([]);
  const supabase = createClient();
  const event_id = params.id;
  const inviteLink = "http://localhost:3000/events/organizer/invite-vendors/";

  useEffect(() => {
    const getVendors = async () => {
      const { data: vendorData, error } = await supabase
        .from("event_vendors")
        .select("profiles(*)")
        .eq("event_id", event_id);
      let vendorsWithPublicUrls = [];
      if (vendorData) {
        vendorsWithPublicUrls = await Promise.all(
          vendorData.map(async (vendor: any) => {
            let {
              data: { publicUrl: vendorPublicUrl },
            } = await supabase.storage
              .from("avatars")
              .getPublicUrl(vendor.profiles.avatar_url);
            return {
              ...vendor,
              vendorPublicUrl,
            };
          })
        );
      }
      setVendors(vendorsWithPublicUrls);
    };
    getVendors();
  }, []);

  const handleCopy = () => {
    const naviagtorCopy = async () => {
      try {
        await navigator.clipboard.writeText(inviteLink);
        toast({
          title: "Invite Link Copied!",
        });
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
    };
    naviagtorCopy();
  };

  return (
    <main className="max-w-lg m-auto w-full">
      <h1 className="font-semibold text-xl">Vendor List</h1>
      {vendors.length == 0 ? (
        <div className="text-lg">Your event currently has no vendors</div>
      ) : (
        <div className="flex space-x-2 flex-wrap">
          {vendors.map((vendor: any) => (
            <div
              key={vendor.id}
              className="h-28 w-28 rounded-full overflow-hidden mt-2"
            >
              <Link href={`/users/${vendor.profiles.id}`}>
                <Image
                  className="block w-full h-full object-cover"
                  alt="avatar"
                  src={vendor.vendorPublicUrl}
                  width={100}
                  height={100}
                />
              </Link>
            </div>
          ))}
        </div>
      )}
      <Button onClick={handleCopy} className="mt-10" variant={"secondary"}>
        Copy Invite Link
      </Button>
    </main>
  );
}
