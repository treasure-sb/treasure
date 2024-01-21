import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { getProfile } from "@/lib/helpers/profiles";
import { validateUser } from "@/lib/actions/auth";
import { User } from "@supabase/supabase-js";
import { Tables } from "@/types/supabase";

export const useProfile = () => {
  const user = useUser();
  const { data } = useQuery({
    queryKey: ["user-profile", user],
    queryFn: async () => {
      const supabase = createClient();
      const { profile } = await getProfile(user?.id);
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from("avatars")
        .getPublicUrl(profile.avatar_url);
      return { profile, publicUrl };
    },
    enabled: !!user,
  });

  const { profile, publicUrl } = data ?? {};
  return { profile, publicUrl };
};

export const useUser = () => {
  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const {
        data: { user },
      } = await validateUser();
      return user;
    },
  });
  return data as User;
};
