import createSupabaseServerClient from "@/utils/supabase/server";

export default async function validateUser() {
  const supabase = await createSupabaseServerClient();
  return supabase.auth.getUser();
}
