import Header from "@/components/shared/header/Header";
import LoggedInHeader from "@/components/shared/header/LoggedInHeader";
import { validateUser } from "@/lib/actions/auth";
import createSupabaseServerClient from "@/utils/supabase/server";
import { getProfile } from "@/lib/helpers/profiles";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    data: { user },
  } = await validateUser();

  const supabase = await createSupabaseServerClient();
  const { profile } = await getProfile(user?.id);
  const {
    data: { publicUrl },
  } = await supabase.storage.from("avatars").getPublicUrl(profile.avatar_url);

  return (
    <div className="p-6 px-4">
      <div className="relative z-10">
        {user ? (
          <LoggedInHeader profile={profile} publicUrl={publicUrl} />
        ) : (
          <Header />
        )}
      </div>
      {children}
    </div>
  );
}
