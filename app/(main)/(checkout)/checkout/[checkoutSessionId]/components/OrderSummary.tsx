import EventCard from "@/components/events/shared/EventCard";
import { Separator } from "@/components/ui/separator";
import { EventDisplayData } from "@/types/event";
import { Tables } from "@/types/supabase";
import { TicketIcon } from "lucide-react";
import { CheckoutTicketInfo } from "../../../types";

export default function OrderSummary({
  promoCode,
  event,
  ticket,
  subtotal,
  priceAfterPromo,
  quantity,
}: {
  promoCode: Tables<"event_codes"> | null;
  event: EventDisplayData;
  ticket: CheckoutTicketInfo;
  subtotal: number;
  priceAfterPromo: number;
  quantity: number;
}) {
  return (
    <div className="space-y-4 w-full md:w-96">
      <div className="w-full">
        <EventCard clickable={false} showLikeButton={false} event={event} />
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
    </div>
  );
}
