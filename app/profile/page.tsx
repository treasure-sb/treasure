import createSupabaseServerClient from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import Link from "next/link";
import validateUser from "@/lib/actions/auth";
import Avatar from "@/components/profile/Avatar";
import Image from "next/image";
import format from "date-fns/format";

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
  const { data: profile, error: fghfgh } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const {
    data: { publicUrl },
  } = await supabase.storage.from("avatars").getPublicUrl(profile.avatar_url);

  let instaLink = "https://www.instagram.com/" + profile.instagram;
  let twitterLink = "https://www.twitter.com/" + profile.twitter;
  const formattedDate = format(new Date(user.created_at), "MMMM do, yyyy");

  return (
    <main className="m-auto max-w-lg">
      <div className="flex flex-col space-y-6 ">
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
        <div className="text-2xl m-auto font-semibold text-center">
          Welcome, {profile.email}!
        </div>
        <Link href="/profile/create-event">
          <Button className="w-full">Host an Event</Button>
        </Link>
        <form action={handleLogout}>
          <Button className="w-full" variant={"secondary"}>
            Logout
          </Button>
        </form>
        <Link
          href="/profile/events"
          className="border-b-2 border-b-secondary pb-6 mb-0"
        >
          <Button className="w-full" variant={"secondary"}>
            My Events
          </Button>
        </Link>
        {profile.instagram && (
          <Link
            className="flex text-2xl space-x-4 justify-center"
            href={instaLink}
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 0H5C2.24 0 0 2.24 0 5V19C0 21.76 2.24 24 5 24H19C21.76 24 24 21.76 24 19V5C24 2.24 21.76 0 19 0ZM22 19C22 20.65 20.65 22 19 22H5C3.35 22 2 20.65 2 19V5C2 3.35 3.35 2 5 2H19C20.65 2 22 3.35 22 5V19Z"
                fill="white"
              />
              <path
                d="M12 5C8.14 5 5 8.14 5 12C5 15.86 8.14 19 12 19C15.86 19 19 15.86 19 12C19 8.14 15.86 5 12 5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17Z"
                fill="white"
              />
              <path
                d="M19 6C19.5523 6 20 5.55228 20 5C20 4.44772 19.5523 4 19 4C18.4477 4 18 4.44772 18 5C18 5.55228 18.4477 6 19 6Z"
                fill="white"
              />
            </svg>
            <h1>@{profile.instagram}</h1>
          </Link>
        )}
        {profile.twitter && (
          <Link
            className="flex text-2xl space-x-4 justify-center"
            href={twitterLink}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
            >
              <path
                d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
                fill="white"
              />
            </svg>
            <h1>@{profile.twitter}</h1>
          </Link>
        )}
        <h1 className="text-2xl text-center">
          On Treasure since{" "}
          <span className="text-primary">{formattedDate}</span>
        </h1>
      </div>
    </main>
  );
}
