import createSupabaseServerClient from "@/utils/supabase/server";
import EditProfileForm from "./components/EditProfileForm";
import Phone from "./components/Phone";
import { Tables } from "@/types/supabase";
import { validateUser } from "@/lib/actions/auth";
import { User } from "@supabase/supabase-js";
import { getProfile } from "@/lib/helpers/profiles";

export default async function Page() {
  const { data: userData } = await validateUser();
  const user: User = userData.user as User;

  const supabase = await createSupabaseServerClient();
  const { profile } = await getProfile(user.id);

  const {
    data: { publicUrl },
  } = await supabase.storage.from("avatars").getPublicUrl(profile.avatar_url);

  const { data } = await supabase
    .from("links")
    .select("username, application, type")
    .eq("user_id", profile.id);
  const linksData: Partial<Tables<"links">>[] = data || [];

  return (
    <main className="m-auto max-w-lg space-y-12">
      <EditProfileForm
        profile={profile}
        avatarUrl={publicUrl}
        userLinks={linksData}
      />
      <Phone profile={profile} />
    </main>
  );
}
