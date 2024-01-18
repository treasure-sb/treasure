import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "../../query";
import TransactionCard from "@/app/(dashboards)/vendor/sales/components/TransactionCard";
import Link from "next/link";

export default function Sales() {
  const user = useUser();
  const { data, isLoading } = useQuery({
    queryKey: ["sales"],
    queryFn: async () => {
      if (!user) return null;
      const supabase = createClient();
      const { data } = await supabase
        .from("vendor_transactions")
        .select("*")
        .eq("vendor_id", user.id)
        .order("created_at", { ascending: false });
      return data ? data : [];
    },
    enabled: !!user,
  });

  return (
    <div className="border-[1px] p-6 rounded-3xl my-4 sm:my-0 dashboard-section-theme sm:hover:opacity-70 transition duration-500 overflow-hidden">
      <Link href="/vendor/sales">
        <h1 className="text-2xl font-semibold text-left mb-6">Sales</h1>
        <div className="space-y-4">
          {(isLoading || !user) && (
            <>
              <Skeleton className="w-full h-9" />
              <Skeleton className="w-full h-9" />
            </>
          )}
          {data &&
            data.slice(0, 6).map((transaction) => {
              return (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  formattedDate={new Date(
                    transaction.created_at
                  ).toLocaleDateString(undefined, {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                />
              );
            })}
        </div>
      </Link>
    </div>
  );
}
