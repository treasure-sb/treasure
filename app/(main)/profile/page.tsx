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
  LucideIcon,
} from "lucide-react";

interface ProfileLinkProps {
  href: string;
  icon: LucideIcon;
  text: string;
  badge?: boolean;
}

const ProfileLink = ({ href, icon: Icon, text, badge }: ProfileLinkProps) => {
  return (
    <Link href={href}>
      <div className="w-full flex gap-4 hover:text-primary px-4 py-4 border-b-2 items-center">
        <Icon className="stroke-2" />
        <p className="font-semibold">{text}</p>
        {badge && <BadgeCheck className="stroke-2 text-primary" />}
      </div>
    </Link>
  );
};

export default async function Page() {
  const { data: userData } = await validateUser();
  const user: User = userData.user as User;

  const { profile } = await getProfile(user.id);
  const formattedDate = format(new Date(user.created_at), "MMMM do, yyyy");

  return (
    <main className="m-auto max-w-lg">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl m-auto font-semibold text-center">
          Welcome, {profile!.first_name}!
        </h1>
        <p className="font-semibold text-primary text-center">
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
          <ProfileLink
            href="/profile/tickets"
            icon={TicketIcon}
            text="My Tickets"
          />
          <ProfileLink
            href="/host/events"
            icon={LayoutDashboardIcon}
            text="Host Dashboard"
          />
          <ProfileLink href="/vendor" icon={Store} text="Vendor Dashboard" />
          {profile!.role === "admin" && (
            <>
              <ProfileLink
                href="/admin"
                icon={Crown}
                text="Admin Dashboard"
                badge
              />
              <ProfileLink
                href="/profile/featured-events"
                icon={Megaphone}
                text="Featured Events"
                badge
              />
              <ProfileLink
                href="/profile/create-profile"
                icon={Users}
                text="Create Temporary Profile"
                badge
              />
              <ProfileLink
                href="/profile/assign"
                icon={UserCheck}
                text="Assign User to Temporary Profile"
                badge
              />
            </>
          )}
        </div>
        <LogoutButton />
      </div>
    </main>
  );
}
