"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function Page({ params }: { params: { id: string } }) {
  const event_id = params.id;
  const vendors: any = [];
  const inviteLink = "http://localhost:3000/events/organizer/invite-vendors/";
  const { toast } = useToast();

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
        <div className="text-lg text-primary">{vendors}</div>
      )}
      <Button onClick={handleCopy} className="mt-10" variant={"secondary"}>
        Copy Invite Link
      </Button>
    </main>
  );
}
