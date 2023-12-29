import Link from "next/link";
import { validateUser, logoutUser } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import createSupabaseServerClient from "@/utils/supabase/server";
import TransactionCard from "./components/TransactionCard";
import { formatDate } from "@/lib/helpers/events";

export default async function Page() {
  const { data: userData } = await validateUser();
  const user: User = userData.user as User;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("vendor_transactions")
    .select("*")
    .eq("vendor_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="m-auto max-w-lg">
      <div className="flex flex-col space-y-6">
        <h1 className="text-2xl m-auto font-semibold text-center">
          Vendors Corner
        </h1>
        {data?.map((transaction) => (
          <div className="flex flex-col">
            <TransactionCard
              transaction={transaction}
              formattedDate={formatDate(transaction.created_at)}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
