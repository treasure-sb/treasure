import Link from "next/link";
import { validateUser, logoutUser } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import createSupabaseServerClient from "@/utils/supabase/server";

export default async function Page() {
  const { data: userData } = await validateUser();
  const user: User = userData.user as User;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("vendor_transactions")
    .select("*")
    .eq("vendor_id", user.id);

  return (
    <main className="m-auto max-w-lg">
      <div className="flex flex-col space-y-6">
        <h1 className="text-2xl m-auto font-semibold text-center">
          Vendors Corner
        </h1>
        {data?.map((transaction) => (
          <div className="flex flex-col border">
            <div className="flex flex-col">
              <p>Amount: ${transaction.amount}</p>
              <p>Item Name: {transaction.item_name}</p>
              <p>Method: {transaction.method}</p>
              <p>Created At: {transaction.created_at}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
