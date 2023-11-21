import createSupabaseServerClient from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import Link from "next/link";
import validateUser from "@/lib/actions/auth";

const handleLogout = async () => {
  "use server";
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/account");
};

const avatarUpload = async (form: FormData) => {
  "use server";
  const file = form.get("avatar") as File;
  console.log(file);
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

  return (
    <main className="m-auto max-w-lg">
      <div className="flex flex-col space-y-6">
        {profile.avatar_url ? (
          <div>avatar</div>
        ) : (
          <form className="relative flex justify-center" action={avatarUpload}>
            <label
              className="hover:cursor-pointer w-28 h-28 rounded-full bg-slate-200"
              htmlFor="avatar"
            >
              <div className="w-24 h-24 rounded-full bg-slate-200"></div>
            </label>
            <input
              name="avatar"
              id="avatar"
              type="file"
              className="w-24 hidden"
            ></input>
            <Button
              className="absolute bottom-0 right-0"
              variant={"secondary"}
              type="submit"
            >
              Upload
            </Button>
          </form>
        )}
        <h1 className="text-2xl m-auto font-semibold text-center">
          Welcome, {profile.email}!
        </h1>
        <Link href="/profile/create-event">
          <Button className="w-full">Throw an Event</Button>
        </Link>
        <form action={handleLogout}>
          <Button className="w-full">Logout</Button>
        </form>
        <Link href="/profile/events">
          <Button className="w-full">My Events</Button>
        </Link>
      </div>
    </main>
  );
}
