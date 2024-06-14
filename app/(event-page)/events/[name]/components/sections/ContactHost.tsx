"use client";

import { Tables } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import InstagramIcon from "@/components/icons/applications/InstagramIcon";
import Link from "next/link";

type OrganizerType = Tables<"profiles"> | Tables<"temporary_profiles">;

export default async function ContactHost({
  organizer,
  profileType,
  renderLinks,
}: {
  organizer: OrganizerType;
  profileType: string;
  renderLinks: any;
}) {
  return (
    <Dialog>
      <DialogTrigger>
        <Button className="text-foreground decoration-primary" variant={"link"}>
          Contact
        </Button>
      </DialogTrigger>
      <DialogContent className="flex items-center flex-col justify-center focus:outline-none">
        <div className="text-2xl font-semibold">Contact Host</div>
        <div>{(organizer as Tables<"profiles">).email}</div>
        {profileType === "profile" ? (
          <>{renderLinks}</>
        ) : (
          (organizer as Tables<"temporary_profiles">).instagram && (
            <Link
              href={`https://www.instagram.com/${
                (organizer as Tables<"temporary_profiles">).instagram
              }`}
              className="flex items-center gap-2"
            >
              <InstagramIcon />
              <div>
                @{(organizer as Tables<"temporary_profiles">).instagram}
              </div>
            </Link>
          )
        )}
      </DialogContent>
    </Dialog>
  );
}
