"use client";

import { useEffect } from "react";
import { useStore } from "../store";
import { parseLocalDate } from "@/lib/utils";
import format from "date-fns/format";
import SalesDateFiltering from "./components/SalesDateFiltering";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "../../query";
import { createClient } from "@/utils/supabase/client";
import TransactionCard from "./components/TransactionCard";
import { Separator } from "@/components/ui/separator";

export default function Page({
  searchParams,
}: {
  searchParams: {
    from?: string;
    until?: string;
  };
}) {
  const { from, until } = searchParams;
  const { setCurrentPage } = useStore();
  useEffect(() => {
    setCurrentPage("sales");
  }, []);

  useEffect(() => {
    refetch();
    console.log("refetching");
  }, [from, until]);

  const user = useUser();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["sales", from, until, user],
    queryFn: async () => {
      if (!user) return null;
      const supabase = createClient();
      if (!from || !until) {
        const { data } = await supabase
          .from("vendor_transactions")
          .select("*")
          .eq("vendor_id", user.id)
          .order("created_at", { ascending: false });
        return data ? data : [];
      } else {
        const { data } = await supabase
          .from("vendor_transactions")
          .select("*")
          .eq("vendor_id", user.id)
          .order("created_at", { ascending: false })
          .gte("created_at", from)
          .lte("created_at", until);
        return data ? data : [];
      }
    },
    enabled: !!user,
  });
  let sales = 0;
  data?.map((transaction) => (sales += transaction.amount));

  return (
    <>
      <h1 className="font-semibold text-3xl mb-6">Sales</h1>
      <div className="flex justify-between mb-6">
        <h1 className="text-4xl relative">
          ${sales}
          {(!from || !until) && (
            <span className="text-sm block text-left text-primary font-semibold">
              All Time Sales
            </span>
          )}
          {from && until && (
            <span className="text-sm block text-left text-primary font-semibold">
              {format(parseLocalDate(from), "MMMM d")} -{" "}
              {format(parseLocalDate(until), "MMMM d")}
            </span>
          )}
        </h1>
        <div className="mt-auto">
          <SalesDateFiltering />
        </div>
      </div>
      <div className="sm:max-w-md flex flex-col gap-3 p-6 dashboard-section-theme rounded-3xl">
        {data &&
          data?.map((transaction, i) => {
            return (
              <>
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  formattedDate={new Date(
                    transaction.created_at
                  ).toLocaleDateString(undefined, {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    timeZone: "UTC",
                  })}
                />
                {!(i === data.length - 1) && <Separator className="bg-black" />}
              </>
            );
          })}
      </div>
    </>
  );
}
