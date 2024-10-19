import EventCard from "@/components/events/shared/EventCard";
import { Separator } from "@/components/ui/separator";
import { EventDisplayData } from "@/types/event";
import { Tables } from "@/types/supabase";
import { TicketIcon } from "lucide-react";
import { PriceInfo } from "../page";
import { CheckoutTicketInfo } from "@/app/(main)/(checkout)/types";

type OrderSummaryProps = {
  event: EventDisplayData;
  ticket: CheckoutTicketInfo;
  checkoutSession: Tables<"checkout_sessions">;
  priceInfo: PriceInfo;
};

export default function OrderSummary({
  event,
  ticket,
  checkoutSession,
  priceInfo,
}: OrderSummaryProps) {
  const { subtotal, promoCode, priceAfterPromo, fee } = priceInfo;
  const { quantity } = checkoutSession;

  return (
    <div className="space-y-4 w-full md:w-96">
      <div className="w-full">
        <EventCard clickable={false} showLikeButton={false} event={event} />
      </div>
      <div className="space-y-8">
        <div>
          <p className="text-lg">Order summary</p>
          <Separator className="my-2" />
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <div className="flex items-center space-x-4">
                <TicketIcon className="text-tertiary stroke-1" size={24} />
                <p>
                  {ticket.name} {ticket.type === "TABLE" && <span>Table</span>}{" "}
                  <span className="text-muted-foreground text-[0.7rem]">
                    x {quantity}
                  </span>
                </p>
              </div>
              <p>{`$${subtotal.toFixed(2)}`}</p>
            </div>

            {promoCode && (
              <div className="flex justify-between text-primary my-1">
                <div className="flex items-center space-x-4">
                  <p className="text-sm italic">Discount {promoCode.code}</p>
                </div>
                <p className="text-sm italic">{`-$${(
                  subtotal - priceAfterPromo
                ).toFixed(2)}`}</p>
              </div>
            )}
          </div>
          {fee !== 0 && fee && (
            <div className="flex justify-between text-muted-foreground my-1">
              <div className="flex items-center space-x-4">
                <p className="text-sm italic">Processing Fee</p>
              </div>
              <p className="text-sm italic">{`+$${fee.toFixed(2)}`}</p>
            </div>
          )}
          <Separator className="my-2" />
          <div>
            <div className="flex justify-between">
              <p className="font-semibold">Total</p>
              <p className="font-semibold">{`$${
                fee
                  ? (priceAfterPromo + fee).toFixed(2)
                  : priceAfterPromo.toFixed(2)
              }`}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
