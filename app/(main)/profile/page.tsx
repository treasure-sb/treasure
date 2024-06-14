import Link from "next/link";
import format from "date-fns/format";
import { getProfile } from "@/lib/helpers/profiles";
import { validateUser, logoutUser } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { Separator } from "@/components/ui/separator";
import LogoutButton from "./components/LogoutButton";
import {
  TicketIcon,
  LayoutDashboardIcon,
  UserCog,
  Image,
  Store,
  BadgeCheck,
  Megaphone,
  Users,
  UserCheck,
  Crown,
} from "lucide-react";

export default async function Page() {
  const { data: userData } = await validateUser();
  const user: User = userData.user as User;

  const { profile } = await getProfile(user.id);
  const formattedDate = format(new Date(user.created_at), "MMMM do, yyyy");

  return (
    <main className="m-auto max-w-lg">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl m-auto font-semibold text-center">
          Welcome, {profile.first_name}!
        </h1>
        <p className="font-semibold bg-gradient-to-r from-primary to bg-green-200 text-transparent bg-clip-text text-center">
          Joined Treasure {formattedDate}
        </p>
        <Separator />
        <div className="grid grid-cols-2 w-full gap-6">
          <Link href="/profile/edit-profile">
            <Button
              className="w-full h-40 rounded-sm flex flex-col gap-3"
              variant={"secondary"}
            >
              <UserCog size="32" className="stroke-2" />
              <p className="text-base">Edit Profile</p>
            </Button>
          </Link>
          <Link href="/profile/portfolio">
            <Button
              className="w-full h-40 rounded-sm flex flex-col gap-3"
              variant={"secondary"}
            >
              <Image size="32" className="stroke-2" />
              <p className="text-base">Edit Photos</p>
            </Button>
          </Link>
        </div>
        <div className="flex flex-col gap-0">
          <Link href="/profile/tickets">
            <div className="w-full flex gap-4 text-white hover:text-primary px-4 py-4 border-b-2 items-center">
              <TicketIcon className="stroke-2" />
              <p className="font-semibold">My Tickets</p>
            </div>
          </Link>
          <Link href="/host/events">
            <div className="w-full flex gap-4 text-white hover:text-primary px-4 py-4 border-b-2 items-center">
              <LayoutDashboardIcon className="stroke-2" />
              <p className="font-semibold">Host Dashboard</p>
            </div>
          </Link>
          <Link href="/vendor">
            <div className="w-full flex gap-4 text-white hover:text-primary px-4 py-4 border-b-2 items-center">
              <Store className="stroke-2" />
              <p className="font-semibold">Vendor Dashboard</p>
            </div>
          </Link>
          {profile.role === "admin" && (
            <>
              <Link href="/admin">
                <div className="w-full flex gap-4 text-white hover:text-primary px-4 py-4 border-b-2 items-center">
                  <Crown className="stroke-2" />
                  <p className="font-semibold">Admin Dashboard</p>
                  <BadgeCheck className="stroke-2 text-primary" />
                </div>
              </Link>
              <Link href="/profile/featured-events">
                <div className="w-full flex gap-4 text-white hover:text-primary px-4 py-4 border-b-2 items-center">
                  <Megaphone className="stroke-2" />
                  <p className="font-semibold">Featured Events</p>
                  <BadgeCheck className="stroke-2 text-primary" />
                </div>
              </Link>
              <Link href="/profile/create-profile">
                <div className="w-full flex gap-4 text-white hover:text-primary px-4 py-4 border-b-2 items-center">
                  <Users className="stroke-2" />
                  <p className="font-semibold">Create Temporary Profile</p>
                  <BadgeCheck className="stroke-2 text-primary" />
                </div>
              </Link>
              <Link href="/profile/assign">
                <div className="w-full flex gap-4 text-white hover:text-primary px-4 py-4 border-b-2 items-center">
                  <UserCheck className="stroke-2" />
                  <p className="font-semibold">
                    Assign User to Temporary Profile
                  </p>
                  <BadgeCheck className="stroke-2 text-primary" />
                </div>
              </Link>
            </>
          )}
        </div>

        <LogoutButton />
      </div>
    </main>
  );
}
