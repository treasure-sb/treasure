import createSupabaseServerClient from "@/utils/supabase/server";
import EditProfileForm from "./EditProfileForm";
import { validateUser } from "@/lib/actions/auth";
import { redirect } from "next/navigation";

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
      <EditProfileForm profile={profile} avatarUrl={publicUrl} />
    </main>
  );
}
