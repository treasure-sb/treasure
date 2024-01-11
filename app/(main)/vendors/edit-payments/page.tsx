import createSupabaseServerClient from "@/utils/supabase/server";
import EditPaymentsForm from "./EditPaymentsForm";
import { validateUser } from "@/lib/actions/auth";
import { User } from "@supabase/supabase-js";
import { getProfile } from "@/lib/helpers/profiles";

export default async function Page() {
  const { data: userData } = await validateUser();
  const user: User = userData.user as User;

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("links")
    .select("type,username")
    .eq("user_id", user.id)
    .in("type", ["venmo", "zelle", "cashapp", "paypal"]);

  let payments = {};

  data?.forEach((payment) => {
    payments = {
      ...payments,
      [payment.type]: payment.username,
    };
  });

  return (
    <main className="m-auto max-w-lg">
      <EditPaymentsForm payments={payments} />
    </main>
  );
}
