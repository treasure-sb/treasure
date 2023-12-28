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
          Vendors Corner
        </h1>
        <Link href="/vendors/sales" className="">
          <Button className="w-full">Sales</Button>
        </Link>
        <Link href="/vendors/edit-payments">
          <Button className="w-full" variant={"secondary"}>
            Payment Methods
          </Button>
        </Link>
      </div>
    </main>
  );
}
