"use client";

import { useEffect, useState } from "react";
import { parseLocalDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "../../query";
import { createClient } from "@/utils/supabase/client";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tables } from "@/types/supabase";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { paymentLinkData } from "@/lib/helpers/links";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import CashIcon from "@/components/icons/CashIcon";
import TransactionCard from "./components/TransactionCard";
import format from "date-fns/format";
import SalesDateFiltering from "./components/SalesDateFiltering";

export default function Page({
  searchParams,
}: {
  searchParams: {
    from?: string;
    until?: string;
  };
}) {
  const { from, until } = searchParams;
  const [selectedTransaction, setSelectedTransaction] =
    useState<Tables<"vendor_transactions"> | null>(null);

  useEffect(() => {
    refetch();
    setSelectedTransaction(null);
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

  const sales = data?.reduce((acc, transaction) => acc + transaction.amount, 0);
  const showDesktopTransaction = (
    transaction: Tables<"vendor_transactions">
  ) => {
    if (selectedTransaction && transaction.id === selectedTransaction.id)
      setSelectedTransaction(null);
    else {
      setSelectedTransaction(transaction);
    }
  };

  const showMobileTransaction = (
    transaction: Tables<"vendor_transactions">
  ) => {
    setSelectedTransaction(transaction);
  };

  const deleteTransaction = async () => {
    setSelectedTransaction(null);
    const supabase = createClient();
    await supabase
      .from("vendor_transactions")
      .delete()
      .eq("id", selectedTransaction?.id);
    refetch();
  };

  const editTransaction = () => {};

  const loadingSkeletons = Array.from({ length: 5 }).map((_, i) => (
    <Skeleton key={i} className="w-full h-12" />
  ));

  return (
    <>
      <h1 className="font-semibold text-3xl mb-6">Sales</h1>
      <div className="flex justify-between mb-6">
        <div className="text-5xl relative">
          {isLoading || !user ? (
            <Skeleton className="h-12 w-32" />
          ) : (
            <h1>${sales}</h1>
          )}
          {(!from || !until) && (
            <span className="text-lg block text-left text-primary font-semibold">
              All Time
            </span>
          )}
          {from && until && (
            <span className="text-lg block text-left text-primary font-semibold">
              {format(parseLocalDate(from), "MMMM d")} -{" "}
              {format(parseLocalDate(until), "MMMM d")}
            </span>
          )}
        </div>
        <div className="mt-auto">
          <SalesDateFiltering />
        </div>
      </div>
      {/* ------------------------------- Desktop Transactions ------------------------------- */}
      <motion.div
        layout
        transition={{ layout: { duration: 0.75, type: "spring" } }}
        className="hidden p-4 sm:flex justify-center space-x-4"
      >
        <motion.div
          layout="position"
          className="space-y-4 p-6 w-full h-fit max-w-md dashboard-section-theme rounded-3xl"
        >
          {(isLoading || !user) && <>{loadingSkeletons}</>}
          {data &&
            data.map((transaction, i) => {
              return (
                <div key={transaction.id}>
                  <div
                    className="text-left w-full cursor-pointer"
                    onClick={() => showDesktopTransaction(transaction)}
                  >
                    <TransactionCard
                      transaction={transaction}
                      formattedDate={new Date(
                        transaction.created_at
                      ).toLocaleDateString(undefined, {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                    />
                  </div>
                  {!(i === data.length - 1) && (
                    <Separator className="bg-black my-4" />
                  )}
                </div>
              );
            })}

          {data && data.length === 0 && (
            <div className="text-center text-gray-400">
              No transactions found
            </div>
          )}
        </motion.div>
        {selectedTransaction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75 }}
            className="flex flex-col gap-3 p-6 w-full max-w-md dashboard-section-theme rounded-3xl h-fit sticky top-0"
          >
            <div className="group w-full overflow-hidden">
              <div className="flex flex-col gap-20">
                <div className="text-center mx-auto flex-col flex gap-2">
                  <div className="mx-auto scale-150 p-2">
                    {paymentLinkData[selectedTransaction.method]?.icon || (
                      <CashIcon />
                    )}
                  </div>
                  <div>
                    <div className="text-xl">
                      {selectedTransaction.item_name &&
                      selectedTransaction.item_name.length > 0
                        ? '" ' + selectedTransaction.item_name + ' "'
                        : '" No Comment "'}
                    </div>
                    <div className="text-sm text-gray-400">
                      {paymentLinkData[selectedTransaction.method]
                        ?.payment_subtext || "Payment made in Cash"}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col text-center gap-1 mx-auto">
                  <div className="text-3xl whitespace-nowrap my-auto text-primary font-semibold">
                    {"+ $" + selectedTransaction.amount}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {new Date(
                      selectedTransaction.created_at
                    ).toLocaleDateString(undefined, {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    }) +
                      " at " +
                      new Date(
                        selectedTransaction.created_at
                      ).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </div>
                </div>

                <div className="flex w-full justify-center gap-[10%] mt-4">
                  <Button
                    className="w-[45%]"
                    onClick={editTransaction}
                    variant={"secondary"}
                  >
                    Edit
                  </Button>
                  <Button
                    className="w-[45%]"
                    onClick={deleteTransaction}
                    variant={"destructive"}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
      {/* ------------------------------- Mobile Transactions  ------------------------------- */}
      <div className="sm:hidden flex flex-col gap-3 p-6 dashboard-section-theme rounded-3xl">
        {(isLoading || !user) && <>{loadingSkeletons}</>}
        {data &&
          data.map((transaction, i) => {
            return (
              <div key={transaction.id}>
                <Dialog>
                  <DialogTrigger className="hover:scale-105 transition duration-500 focus:outline-none w-full">
                    <div
                      className="w-full text-left"
                      onClick={() => showMobileTransaction(transaction)}
                    >
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
                    </div>
                  </DialogTrigger>
                  <DialogContent className="flex items-center justify-center w-3/4 focus:outline-none">
                    {selectedTransaction && (
                      <div className="flex flex-col w-full">
                        <div className="group w-full overflow-hidden">
                          <div className="flex flex-col gap-20">
                            <div className="text-center mx-auto flex-col flex gap-2">
                              <div className="mx-auto scale-150 p-2">
                                {paymentLinkData[selectedTransaction.method]
                                  ?.icon || <CashIcon />}
                              </div>
                              <div>
                                <div className="text-xl">
                                  {selectedTransaction.item_name &&
                                  selectedTransaction.item_name.length > 0
                                    ? '" ' +
                                      selectedTransaction.item_name +
                                      ' "'
                                    : '" No Comment "'}
                                </div>
                                <div className="text-sm text-gray-400">
                                  {paymentLinkData[selectedTransaction.method]
                                    ?.payment_subtext || "Payment made in Cash"}
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col text-center gap-1 mx-auto">
                              <div className="text-3xl whitespace-nowrap my-auto text-primary font-semibold">
                                {"+ $" + selectedTransaction.amount}
                              </div>
                              <div className="text-gray-400 text-sm">
                                {new Date(
                                  selectedTransaction.created_at
                                ).toLocaleDateString(undefined, {
                                  weekday: "short",
                                  day: "numeric",
                                  month: "short",
                                }) +
                                  " at " +
                                  new Date(
                                    selectedTransaction.created_at
                                  ).toLocaleTimeString(undefined, {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                              </div>
                            </div>

                            <div className="flex w-full justify-center gap-[10%] mt-4">
                              <DialogClose className="w-[45%]">
                                <Button
                                  className="w-full"
                                  onClick={deleteTransaction}
                                  variant={"destructive"}
                                >
                                  Delete
                                </Button>
                              </DialogClose>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>

                {!(i === data.length - 1) && (
                  <Separator className="bg-black my-4" />
                )}
              </div>
            );
          })}
        {data && data.length === 0 && (
          <div className="text-center text-gray-400">No transactions found</div>
        )}
      </div>
    </>
  );
}
