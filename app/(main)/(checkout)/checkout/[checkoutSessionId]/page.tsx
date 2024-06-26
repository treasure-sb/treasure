import InitializeCheckout from "./components/InitializeCheckout";
import createSupabaseServerClient from "@/utils/supabase/server";
import EventCard from "@/components/events/shared/EventCard";
import { Tables } from "@/types/supabase";
import { getEventDisplayData } from "@/lib/helpers/events";
import { Separator } from "@/components/ui/separator";
import { TicketIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/helpers/profiles";
import PromoCode from "./components/PromoCode";

interface CheckoutTicketInfo {
  name: string;
  price: number;
}

const getTicketInfo = async (ticketId: string) => {
  const supabase = await createSupabaseServerClient();
  const { data: ticketData, error: ticketError } = await supabase
    .from("tickets")
    .select("name, price")
    .eq("id", ticketId)
    .single();

  if (ticketError) {
    throw new Error("Error fetching ticket data");
  }

  return {
    name: ticketData.name,
    price: ticketData.price,
  };
};

const getTableInfo = async (ticketId: string) => {
  const supabase = await createSupabaseServerClient();
  const { data: tableData, error: tableError } = await supabase
    .from("tables")
    .select("section_name, price")
    .eq("id", ticketId)
    .single();

  if (tableError) {
    throw new Error("Error fetching table data");
  }
  return {
    name: tableData.section_name,
    price: tableData.price,
  };
};

export default async function Page({
  params,
}: {
  params: { checkoutSessionId: string };
}) {
  const checkoutSessionId = params.checkoutSessionId;
  const supabase = await createSupabaseServerClient();
  const { data: checkoutSessionData, error: checkoutSessionError } =
    await supabase
      .from("checkout_sessions")
      .select("*")
      .eq("id", checkoutSessionId)
      .single();

  if (checkoutSessionError) {
    redirect("/events");
  }

  const checkoutSession: Tables<"checkout_sessions"> = checkoutSessionData;
  const { event_id, ticket_id, ticket_type, quantity, promo_id } =
    checkoutSession;
  const { data: eventData } = await supabase
    .from("events")
    .select("*")
    .eq("id", event_id)
    .single();
  const event: Tables<"events"> = eventData;
  const eventDisplay = await getEventDisplayData(event);
  const { profile } = await getProfile(checkoutSession.user_id);

  let promoCode: Tables<"event_codes"> | null = null;
  if (promo_id) {
    const { data: promoCodeData, error: promoCodeError } = await supabase
      .from("event_codes")
      .select("*")
      .eq("id", promo_id)
      .single();

    if (!promoCodeData || promoCodeError) {
      throw new Error("Invalid promo code");
    }
    promoCode = promoCodeData;
  }

  let totalPrice: number;
  let ticket: CheckoutTicketInfo;
  switch (ticket_type) {
    case "TICKET":
      ticket = await getTicketInfo(ticket_id);
      break;
    case "TABLE":
      ticket = await getTableInfo(ticket_id);
      break;
    default:
      throw new Error("Invalid Ticket Type");
  }

  totalPrice = ticket.price * quantity;

  let priceAfterPromo = totalPrice;

  if (promoCode) {
    if (promoCode.type === "PERCENT") {
      priceAfterPromo = totalPrice - totalPrice * (promoCode.discount / 100);
    } else {
      priceAfterPromo = Math.max(totalPrice - promoCode.discount, 0);
    }
  }

  return (
    <main className="max-w-6xl m-auto">
      <div className="flex flex-col space-y-20 items-center md:flex-row md:items-start md:justify-center md:space-x-20 md:space-y-0">
        <div className="space-y-4 w-full md:w-96">
          <div className="w-full">
            <EventCard
              clickable={false}
              showLikeButton={false}
              event={eventDisplay}
            />
          </div>
          <div className="space-y-8">
            <div>
              <p className="text-lg">Order summary</p>
              <Separator className="my-2" />
              <div>
                <div className="flex justify-between">
                  <div className="flex items-center space-x-4">
                    <TicketIcon className="text-tertiary stroke-1" size={24} />
                    <p>
                      {ticket.name}{" "}
                      {ticket_type === "TABLE" && <span>Table</span>} x{" "}
                      {quantity}
                    </p>
                  </div>
                  <p>{`$${totalPrice.toFixed(2)}`}</p>
                </div>
                {promoCode && (
                  <div className="flex justify-between text-primary">
                    <div className="flex items-center space-x-4">
                      <p className="text-sm">Discount</p>
                    </div>
                    <p className="text-sm">{`-$${(
                      totalPrice - priceAfterPromo
                    ).toFixed(2)}`}</p>
                  </div>
                )}
                <Separator className="my-2" />
                <div>
                  <div className="flex justify-between">
                    <p className="font-semibold">Total</p>
                    <p className="font-semibold">{`$${priceAfterPromo.toFixed(
                      2
                    )}`}</p>
                  </div>
                </div>
              </div>
            </div>
            <PromoCode
              event={eventDisplay}
              promoApplied={promoCode}
              checkoutSession={checkoutSession}
              price={totalPrice}
            />
          </div>
        </div>
        <InitializeCheckout
          checkoutSession={checkoutSession}
          totalPrice={priceAfterPromo}
          profile={profile}
        />
      </div>
    </main>
  );
}
