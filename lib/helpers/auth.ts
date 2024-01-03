"use server";
import createSupabaseServerClient from "@/utils/supabase/server";

const getSignupInviteData = async (inviteToken: string) => {
  const supabase = await createSupabaseServerClient();
  const { data: signupInviteData } = await supabase
    .from("signup_invite_tokens")
    .select("*")
    .eq("token", inviteToken)
    .single();

  return signupInviteData;
};

const generateUniqueLocalDiscriminator = (
  discriminators: any[] | undefined
): number => {
  if (!discriminators || discriminators.length === 0) {
    return 1;
  }

  const sortedDiscriminators = discriminators.sort((a, b) => a - b);
  const lastDiscriminator =
    sortedDiscriminators[sortedDiscriminators.length - 1];
  return lastDiscriminator + 1;
};

const getPreviousDiscriminators = async (username: string) => {
  const supabase = await createSupabaseServerClient();
  const { data: profilesData } = await supabase
    .from("profiles")
    .select("discriminator")
    .eq("username", username);
  return profilesData?.map((profile) => profile.discriminator) || [];
};

export {
  getSignupInviteData,
  generateUniqueLocalDiscriminator,
  getPreviousDiscriminators,
};
