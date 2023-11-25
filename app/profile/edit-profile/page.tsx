import { redirect } from "next/navigation";
import createSupabaseServerClient from "@/utils/supabase/server";
import EditProfileForm from "@/components/profile/EditProfileForm";
import validateUser from "@/lib/actions/auth";
import Avatar from "@/components/profile/Avatar";
import Image from "next/image";

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
      </div>
      <EditProfileForm profileform={profile} profile={profile} />
    </main>
  );
}
