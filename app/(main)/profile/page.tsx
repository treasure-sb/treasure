import Link from "next/link";
import format from "date-fns/format";
import { getProfile } from "@/lib/helpers/profiles";
import { validateUser, logoutUser } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { Separator } from "@/components/ui/separator";
import LogoutButton from "./components/LogoutButton";

export default async function Page() {
  const { data: userData } = await validateUser();
  const user: User = userData.user as User;

  const { profile } = await getProfile(user.id);
  const formattedDate = format(new Date(user.created_at), "MMMM do, yyyy");

  return (
    <main className="m-auto max-w-lg">
      <div className="flex flex-col space-y-6">
        <h1 className="text-2xl m-auto font-semibold text-center">
          Welcome, {profile.first_name}!
        </h1>
        <p className="font-semibold bg-gradient-to-r from-primary to bg-green-200 text-transparent bg-clip-text text-center">
          Joined Treasure {formattedDate}
        </p>
        <Separator />
        <Link href="/profile/tickets">
          <Button className="w-full font-bold">My Tickets</Button>
        </Link>
        <Link href="/host/events">
          <Button className="w-full" variant={"tertiary"}>
            Host Dashboard
          </Button>
        </Link>
        <Link href="/vendor">
          <Button className="w-full" variant={"tertiary"}>
            Vendor Dashboard
          </Button>
        </Link>

        <Link href="/profile/edit-profile">
          <Button className="w-full" variant={"secondary"}>
            Edit Profile
          </Button>
        </Link>
        <Link href="/profile/portfolio" className="">
          <Button className="w-full" variant={"secondary"}>
            Edit Photos
          </Button>
        </Link>
        {profile.role === "admin" && (
          <>
            <Link href="/profile/featured-events" className="">
              <Button className="w-full" variant={"secondary"}>
                Featured Events
              </Button>
            </Link>
            <Link href="/profile/create-profile" className="">
              <Button className="w-full" variant={"secondary"}>
                Create Temporary Profile
              </Button>
            </Link>
            <Link href="/profile/assign">
              <Button variant={"secondary"} className="w-full">
                Assign User to Temporary Profile
              </Button>
            </Link>
          </>
        )}
        <LogoutButton />
      </div>
    </main>
  );
}
