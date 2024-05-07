import { User } from "@supabase/supabase-js";
import { getProfile } from "@/lib/helpers/profiles";
import AdminOptions from "./AdminOptions";
import Link from "next/link";
import EditEventIcon from "@/components/icons/EditEventIcon";

/* Admin and Host Options */
export default async function EventOptions({
  event,
  user,
}: {
  event: any;
  user: User | null;
}) {
  const { profile } = await getProfile(user?.id);
  const profileIsAdmin = profile && profile.role === "admin";
  const profileIsOrganizer = event.organizer_id === user?.id;

  return (
    <div className="fixed right-6 bottom-6 flex flex-col space-y-4 items-end z-20">
      {profileIsAdmin && <AdminOptions event={event} />}
      {(profileIsOrganizer || profileIsAdmin) && (
        <Link href={`/host/events/${event.cleaned_name}`}>
          <div className="opacity-80 sm:opacity-60 hover:opacity-100 transition duration-300">
            <EditEventIcon />
          </div>
        </Link>
      )}
    </div>
  );
}
