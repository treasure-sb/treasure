import createSupabaseServerClient from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import Link from "next/link";
import validateUser from "@/lib/actions";

export default async function Page() {
  const { data } = await validateUser();
  if (!data.user) {
    redirect("/account");
  }

  const handleLogout = async () => {
    "use server";
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
    redirect("/account");
  };

  return (
    <main className="m-auto max-w-lg">
      <div className="flex flex-col space-y-6">
        <h1 className="text-2xl m-auto font-semibold">{data.user?.email}</h1>
        <Link href="/profile/create-event">
          <Button className="w-full">Throw an Event</Button>
        </Link>
        <form action={handleLogout}>
          <Button className="w-full">Logout</Button>
        </form>
      </div>
    </main>
  );
}
