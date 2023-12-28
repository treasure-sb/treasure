import Link from "next/link";
import { validateUser, logoutUser } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";

export default async function Page() {
  const { data: userData } = await validateUser();
  const user: User = userData.user as User;

  return (
    <main className="m-auto max-w-lg">
      <div className="flex flex-col space-y-6">
        <h1 className="text-2xl m-auto font-semibold text-center">
          Manage Account
        </h1>
        <Link href="/profile/create-event">
          <Button className="w-full">Host an Event</Button>
        </Link>
        <Link href="/profile/edit-profile" className="">
          <Button className="w-full" variant={"secondary"}>
            Edit Profile
          </Button>
        </Link>
        <Link href="/profile/portfolio" className="">
          <Button className="w-full" variant={"secondary"}>
            Portfolio Photos
          </Button>
        </Link>
        <Link href="/vendors" className="">
          <Button className="w-full" variant={"secondary"}>
            Vendors Corner
          </Button>
        </Link>
        <form action={logoutUser}>
          <Button
            className="w-full bg-red-500 bg-opacity-50"
            variant={"secondary"}
          >
            Logout
          </Button>
        </form>
      </div>
    </main>
  );
}
