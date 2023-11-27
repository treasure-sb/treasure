import Link from "next/link";
import createSupabaseServerClient from "@/utils/supabase/server";
import { validateUser } from "@/lib/actions/auth";
import Image from "next/image";

export default async function LoggedInHeader() {
  const { data } = await validateUser();
  const user = data.user;

  const supabase = await createSupabaseServerClient();
  const { data: profile, error: fghfgh } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  const {
    data: { publicUrl },
  } = await supabase.storage.from("avatars").getPublicUrl(profile.avatar_url);

  return (
    <header className="flex justify-between md:max-w-6xl xl:max-w-7xl m-auto w-full mb-10 items-center">
      <Link href="/" className="font-bold text-3xl">
        Treasure
      </Link>
      <Link href="/profile">
        {profile.avatar_url ? (
          <div className="h-12 w-12 rounded-full overflow-hidden">
            <Image
              className="block w-full h-full object-cover"
              alt="avatar"
              src={publicUrl}
              width={100}
              height={100}
            />
          </div>
        ) : (
          <h1>My Profile</h1>
        )}
      </Link>
    </header>
  );
}
