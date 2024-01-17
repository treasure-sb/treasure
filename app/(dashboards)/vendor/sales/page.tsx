"use client";

import { useEffect, useState } from "react";
import { useStore } from "../store";
import { parseLocalDate } from "@/lib/utils";
import format from "date-fns/format";
import SalesDateFiltering from "./components/SalesDateFiltering";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "../../query";
import { createClient } from "@/utils/supabase/client";
import TransactionCard from "./components/TransactionCard";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tables } from "@/types/supabase";
import CashappIcon from "@/components/icons/applications/CashappIcon";
import VenmoIcon from "@/components/icons/applications/VenmoIcon";
import CashIcon from "@/components/icons/CashIcon";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";

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
  const { setCurrentPage } = useStore();

  useEffect(() => {
    setCurrentPage("sales");
  }, []);

  useEffect(() => {
    refetch();
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

  const showDesktopTransaction = (
    transaction: Tables<"vendor_transactions">
  ) => {
    if (selectedTransaction && transaction.id === selectedTransaction.id)
      setSelectedTransaction(null);
    else {
      setSelectedTransaction(transaction);
    }

    console.log(selectedTransaction);
  };

  const showMobileTransaction = (
    transaction: Tables<"vendor_transactions">
  ) => {
    setSelectedTransaction(transaction);
  };

  const deleteTransaction = async () => {
    setSelectedTransaction(null);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("vendor_transactions")
      .delete()
      .eq("id", selectedTransaction?.id);
    refetch();
  };

  const editTransaction = () => {
    console.log("editing");
    console.log(selectedTransaction);
    console.log("edited");
  };

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
      {/* ------------------------------- Desktop Transactions ------------------------------- */}
      <div className="hidden p-4 sm:grid grid-cols-2 gap-4 w-full">
        <div className=" sm:flex flex-col gap-3 p-6 w-full max-w-md dashboard-section-theme rounded-3xl">
          {data &&
            data?.map((transaction, i) => {
              return (
                <>
                  <button
                    className="text-left"
                    onClick={() => showDesktopTransaction(transaction)}
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
                        timeZone: "UTC",
                      })}
                    />
                  </button>
                  {!(i === data.length - 1) && (
                    <Separator className="bg-black" />
                  )}
                </>
              );
            })}
        </div>
        {selectedTransaction && (
          <div className="flex flex-col gap-3 p-6 w-full max-w-md dashboard-section-theme rounded-3xl h-fit sticky top-0">
            <div className="group w-full overflow-hidden">
              <div className="flex flex-col gap-20">
                <div className="text-center mx-auto flex-col flex gap-2">
                  <div className="mx-auto scale-150 p-2">
                    {(() => {
                      switch (selectedTransaction.method) {
                        case "Cashapp":
                          return <CashappIcon />;
                        case "Venmo":
                          return <VenmoIcon />;
                        default:
                          return <CashIcon />;
                      }
                    })()}
                  </div>
                  <div>
                    <div className="text-xl">
                      {selectedTransaction.item_name &&
                      selectedTransaction.item_name.length > 0
                        ? '" ' + selectedTransaction.item_name + ' "'
                        : '" No Comment "'}
                    </div>
                    <div className="text-sm text-gray-400">
                      {(() => {
                        switch (selectedTransaction.method) {
                          case "Cashapp":
                            return "Payment made through Cashapp";
                          case "Venmo":
                            return "Payment made through Venmo";
                          default:
                            return "Payment made in Cash";
                        }
                      })()}
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
                      timeZone: "UTC",
                    }) +
                      " at " +
                      new Date(
                        selectedTransaction.created_at
                      ).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: "UTC",
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
          </div>
        )}
      </div>
      {/* ------------------------------- Mobile Transactions  ------------------------------- */}
      <div className="sm:hidden flex flex-col gap-3 p-6 dashboard-section-theme rounded-3xl">
        {data &&
          data?.map((transaction, i) => {
            return (
              <>
                <Dialog>
                  <DialogTrigger className="hover:scale-110 transition duration-300 focus:outline-none w-full">
                    <button onClick={() => showMobileTransaction(transaction)}>
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
                    </button>
                  </DialogTrigger>
                  <DialogContent className="flex items-center justify-center w-3/4 focus:outline-none">
                    {selectedTransaction && (
                      <div className="flex flex-col w-full">
                        <div className="group w-full overflow-hidden">
                          <div className="flex flex-col gap-20">
                            <div className="text-center mx-auto flex-col flex gap-2">
                              <div className="mx-auto scale-150 p-2">
                                {(() => {
                                  switch (selectedTransaction.method) {
                                    case "Cashapp":
                                      return <CashappIcon />;
                                    case "Venmo":
                                      return <VenmoIcon />;
                                    default:
                                      return <CashIcon />;
                                  }
                                })()}
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
                                  {(() => {
                                    switch (selectedTransaction.method) {
                                      case "Cashapp":
                                        return "Payment made through Cashapp";
                                      case "Venmo":
                                        return "Payment made through Venmo";
                                      default:
                                        return "Payment made in Cash";
                                    }
                                  })()}
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
                                  timeZone: "UTC",
                                }) +
                                  " at " +
                                  new Date(
                                    selectedTransaction.created_at
                                  ).toLocaleTimeString(undefined, {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    timeZone: "UTC",
                                  })}
                              </div>
                            </div>

                            <div className="flex w-full justify-center gap-[10%] mt-4">
                              {/* <Button
                                className="w-[45%]"
                                onClick={editTransaction}
                                variant={"secondary"}
                              >
                                Edit
                              </Button> */}
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

                {!(i === data.length - 1) && <Separator className="bg-black" />}
              </>
            );
          })}
      </div>
    </>
  );
}
