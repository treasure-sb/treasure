import { validateUser } from "@/lib/actions/auth";
import { getProfile, getProfileByUsername } from "@/lib/helpers/profiles";
import { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import EditForm from "./components/EditForm";
import createSupabaseServerClient from "@/utils/supabase/server";
import { Tables } from "@/types/supabase";
import EditProfileForm from "@/app/(main)/profile/edit-profile/components/EditProfileForm";

export default async function Page({ params }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await validateUser();
  const username = decodeURIComponent(params.id);

  if (!userData) {
    redirect("/login");
  }

  const user: User = userData.user as User;
  const { profile: loggedInProfile } = await getProfile(user.id);

  if (loggedInProfile.role !== "admin") {
    redirect(`/${username}`);
  }

  const { profile: profileToEdit, error } = await getProfileByUsername(
    username
  );

  if (error) {
    redirect("/events");
  }

  const {
    data: { publicUrl },
  } = await supabase.storage
    .from("avatars")
    .getPublicUrl(profileToEdit.avatar_url);

  const { data } = await supabase
    .from("links")
    .select("username, application, type")
    .eq("user_id", profileToEdit.id);
  const linksData: Partial<Tables<"links">>[] = data || [];

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="font-semibold text-2xl mb-4">
        {profileToEdit.first_name}'s Profile
      </h2>
      <EditProfileForm
        profile={profileToEdit}
        avatarUrl={publicUrl}
        userLinks={linksData}
      />
    </div>
  );
}
