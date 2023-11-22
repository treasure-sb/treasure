import createSupabaseServerClient from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import Link from "next/link";
import validateUser from "@/lib/actions/auth";
import Avatar from "@/components/profile/Avatar";
import Image from "next/image";

const handleLogout = async () => {
  "use server";
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/account");
};

export default async function Page() {
  const { data } = await validateUser();
  const user = data.user;
  if (!user) {
    redirect("/account");
  }

  const supabase = await createSupabaseServerClient();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const {
    data: { publicUrl },
  } = await supabase.storage.from("avatars").getPublicUrl(profile.avatar_url);

  return (
    <main className="m-auto max-w-lg">
      <div className="flex flex-col space-y-6">
        {profile.avatar_url ? (
          <Image
            className=" mx-auto rounded-full"
            alt="avatar"
            src={publicUrl}
            width={100}
            height={100}
          />
        ) : (
          <Avatar id={profile.id} />
        )}
        <h1 className="text-2xl m-auto font-semibold text-center">
          Welcome, {profile.email}!
        </h1>
        <Link href="/profile/create-event">
          <Button className="w-full">Host an Event</Button>
        </Link>
        <form action={handleLogout}>
          <Button className="w-full" variant={'secondary'}>Logout</Button>
        </form>
        <Link href="/profile/events">
          <Button className="w-full" variant={'secondary'}>My Events</Button>
        </Link>
      </div>
    </main>
  );
}
