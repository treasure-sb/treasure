import { DataTable } from "./components/DataTable";
import { columns, Order } from "./components/OrderDataColumns";
import { Tables } from "@/types/supabase";
import { getProfileAvatar } from "@/lib/helpers/profiles";
import type { CustomerData } from "./types";
import { Suspense } from "react";
import DateRangeFilter from "./components/DateRangeFilter";
import createSupabaseServerClient from "@/utils/supabase/server";
import SalesAnalytics from "./components/charts/SalesAnalytics";
import Image from "next/image";
import { EventWithDates } from "@/types/event";
import { formatDates } from "@/lib/utils";

type OrderData = Tables<"orders"> & {
  profile: Tables<"profiles">;
} & {
  line_items: Tables<"line_items">[];
} & { event: EventWithDates } & { code: Tables<"event_codes"> | null };

type Payout = {
  host_id: string;
  amount: number;
  event_name: string;
  event_id: string;
  event_dates: string;
  dateForOrdering: number;
  date: string;
  poster_url: string;
  payout_location: string;
  payout_info: string;
};

type invoice = {
  host: string;
  amount: number;
  event: string;
  date: string;
  username: string;
  contact: string;
  event_dates: string;
  avatar_url: string;
  payout_location: string;
  payout_info: string;
};

export default async function Page({
  searchParams: { from, to, period },
}: {
  searchParams: { from?: string; to?: string; period?: string };
}) {
  const supabase = await createSupabaseServerClient();
  const length = period === "30d" ? 30 : 7;

  let payouts: Payout[] = [];
  let gmv = 0;

  let orderQuery = supabase
    .from("orders")
    .select(
      "*, profile:profiles(*), line_items(*), event:events(*,dates:event_dates(date, start_time, end_time), event_roles(*)), code:event_codes(*)"
    )
    .order("created_at", { ascending: false });

  if (from) {
    orderQuery = orderQuery.gte("created_at", from);
  }
  if (to) {
    orderQuery = orderQuery.lte("created_at", to);
  }

  const { data: orderData, error: err } = await orderQuery;
  const orders: OrderData[] = orderData || [];

  const { data: invoice_location, error } = await supabase
    .from("links")
    .select("*")
    .eq("type", "invoice");

  const tableDataPromise: Promise<Order>[] = orders.map(async (order) => {
    const publicAvatarUrl = await getProfileAvatar(order.profile.avatar_url);
    const customer: CustomerData = { ...order.profile, publicAvatarUrl };
    const item = order.line_items[0];

    let amountPaid = order.amount_paid;

    if (order.code?.treasure_sponsored === true) {
      amountPaid =
        order.code.type === "PERCENT"
          ? order.amount_paid / (1 - order.code.discount / 100)
          : order.amount_paid + order.code.discount;
    }

    let itemName = "";
    if (item.item_type === "TICKET") {
      const { data: ticketData } = await supabase
        .from("tickets")
        .select("name")
        .eq("id", item.item_id)
        .single();
      itemName = ticketData?.name;
    } else {
      const { data: tableData } = await supabase
        .from("tables")
        .select("section_name")
        .eq("id", item.item_id)
        .single();
      itemName = tableData?.section_name;
    }

    let index = -1;

    // check if payout already exists for the event and date
    payouts.map((payout, i) => {
      if (
        payout.event_id === order.event.id &&
        payout.date === new Date(order.created_at).toLocaleDateString()
      ) {
        payouts[i].amount += amountPaid;
        index = i;
      }
    });

    // create new payout if it doesn't exist
    if (index === -1) {
      let organizerID = "";
      order.event.event_roles.map((role) => {
        if (role.role === "HOST") organizerID = role.user_id;
      });

      // filter links to see if we know where to pay host out to (venmo, paypal, etc)
      let organizerInvoiceInfo: any[] =
        invoice_location === null
          ? []
          : invoice_location?.filter(
              (person) => person.user_id === organizerID
            );

      let tempDates = formatDates(order.event.dates);
      let formattedDate = new Date(order.created_at).toLocaleDateString();

      payouts.push({
        host_id: organizerID,
        amount: amountPaid,
        event_name: order.event.name,
        event_id: order.event.id,
        event_dates:
          tempDates.length > 1
            ? `${tempDates[0].date} - ${tempDates[tempDates.length - 1].date}`
            : tempDates[0].date,
        dateForOrdering: new Date(formattedDate).getTime(),
        date: formattedDate,
        poster_url: order.event.poster_url,
        payout_location:
          organizerInvoiceInfo.length > 0
            ? organizerInvoiceInfo[0].application
            : "N/A",
        payout_info:
          organizerInvoiceInfo.length > 0
            ? organizerInvoiceInfo[0].username
            : "N/A",
      });
    }

    gmv += amountPaid;

    return {
      orderID: order.id,
      quantity: order.line_items[0].quantity,
      amountPaid: amountPaid,
      type: order.line_items[0].item_type,
      purchaseDate: new Date(order.created_at),
      itemName: itemName,
      customer: customer,
      promoCode: order.code,
    };
  });

  const tableData = await Promise.all(tableDataPromise);

  payouts.sort(
    (a, b) => b.dateForOrdering - a.dateForOrdering || b.amount - a.amount
  );

  const payoutsPromise: Promise<invoice>[] = payouts.map(async (payout) => {
    let host = "";
    let username = "";
    let contact = "";
    let publicAvatarUrl = "";

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", payout.host_id)
      .single();

    host =
      profileData.business_name === null
        ? profileData.first_name + " " + profileData.last_name
        : profileData.business_name;
    username = profileData.username;
    contact = profileData.email ? profileData.email : "";
    contact = profileData.phone_number
      ? contact + " " + profileData.phone_number
      : contact;
    publicAvatarUrl = await getProfileAvatar(profileData.avatar_url);

    return {
      host: host,
      amount: payout.amount,
      event: payout.event_name,
      date: new Date(payout.date).toLocaleDateString(undefined, {
        weekday: "long",
        day: "numeric",
        month: "short",
      }),
      username: username,
      contact: contact,
      event_dates: payout.event_dates,
      avatar_url: publicAvatarUrl,
      payout_location: payout.payout_location,
      payout_info: payout.payout_info,
    };
  });

  const invoices = (await Promise.all(payoutsPromise)).slice(0, 10);

  return (
    <div className="max-w-7xl mx-auto py-10 flex flex-col gap-10">
      <div>
        <div className="text-2xl pl-4 font-semibold pb-4 flex w-full justify-between items-end">
          <p>Last 5 Invoices</p>
          <p className="text-base">
            All Time GMV <span className="text-primary text-2xl">${gmv}</span>
          </p>
        </div>
        <div className="border-2 rounded-md flex flex-col w-full">
          {invoices?.map((invoice) => {
            return (
              <div className="flex overflow-auto sm:grid sm:grid-cols-6 w-full justify-between items-center border-b-2 p-4">
                <div className="col-span-1 font-semibold">{invoice.date}</div>
                <div className="text-left col-span-2">
                  <p className="font-semibold">{invoice.event}</p>
                  <p className="text-sm">{invoice.event_dates}</p>
                </div>
                <div className="flex gap-4 items-center col-span-2">
                  <div
                    className="relative shrink-0"
                    style={{
                      width: "75px",
                      height: "75px",
                    }}
                  >
                    <Image
                      className={`rounded-full group-hover:bg-black group-hover:opacity-50 transition duration-300`}
                      alt="image"
                      src={invoice.avatar_url}
                      fill
                      sizes="75px"
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-base font-semibold">{invoice.host}</p>
                    <p className="text-xs">@{invoice.username}</p>
                    <p className="text-xs mt-2">
                      {invoice.payout_location === "N/A"
                        ? "No Payout Method Recorded"
                        : invoice.payout_location + ": " + invoice.payout_info}
                    </p>
                    <p className="text-xs mt-2">{invoice.contact}</p>
                  </div>
                </div>
                <div className="col-span-1 text-right font-semibold">
                  ${invoice.amount}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <SalesAnalytics periodLength={length} />
      <div>
        <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:justify-between mb-4">
          <h1 className="text-2xl font-semibold">
            All Orders{" "}
            <span className="text-muted-foreground">{orders.length}</span>
          </h1>
          <Suspense>
            <DateRangeFilter />
          </Suspense>
        </div>
        <DataTable columns={columns} data={tableData} />
      </div>
    </div>
  );
}
