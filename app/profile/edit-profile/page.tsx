import { redirect } from "next/navigation";
import createSupabaseServerClient from "@/utils/supabase/server";
import EditProfileForm from "@/components/profile/EditProfileForm";
import { validateUser } from "@/lib/actions/auth";

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
