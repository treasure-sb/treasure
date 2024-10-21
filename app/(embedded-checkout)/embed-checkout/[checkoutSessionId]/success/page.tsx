import createSupabaseServerClient from "@/utils/supabase/server";
import Image from "next/image";
import Blurred from "@/app/(event-page)/events/[name]/components/Blurred";
import Link from "next/link";
import { getEventDisplayData } from "@/lib/helpers/events";
import { redirect } from "next/navigation";
import { EventWithDates } from "@/types/event";
import { HelpingHand, TicketIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type PriceType = "REGULAR" | "RSVP";

export interface TicketSuccessInformation {
  ticketName: string;
  quantity: number;
  priceType: PriceType;
  amountPaid: number;
}

const getTicketInfo = async (ticketId: string) => {
  const supabase = await createSupabaseServerClient();
  const { data: ticketData, error: ticketError } = await supabase
    .from("tickets")
    .select("name, price")
    .eq("id", ticketId)
    .single();

  if (ticketError) {
    throw new Error("Error fetching ticket name");
  }

  return ticketData;
};

export default async function Page({
  params,
}: {
  params: {
    checkoutSessionId: string;
  };
}) {
  const checkoutSessionId = params.checkoutSessionId;
  const supabase = await createSupabaseServerClient();
  const { data: checkoutSessionData, error: checkoutSessionError } =
    await supabase
      .from("checkout_sessions")
      .select(
        "*, event:events(*, dates:event_dates(date, start_time, end_time), event_roles(*)), ticket_id, profile:profiles(email), promo:event_codes(*)"
      )
      .eq("id", checkoutSessionId)
      .single();

  if (checkoutSessionError) {
    redirect("/events");
  }

  const event: EventWithDates = checkoutSessionData.event;
  const priceType = checkoutSessionData.price_type as PriceType;
  const eventDisplay = await getEventDisplayData(event);

  let tInfo = await getTicketInfo(checkoutSessionData.ticket_id);

  let price: number =
    checkoutSessionData.promo === null
      ? tInfo.price
      : checkoutSessionData.promo.type === "DOLLAR"
      ? tInfo.price - checkoutSessionData.promo.discount
      : tInfo.price * (1 - checkoutSessionData.promo.discount * 0.01);
  price = price < 0 ? 0 : price;

  const quantity = checkoutSessionData.quantity;

  return (
    <main className="max-w-6xl m-auto">
      <>
        <div className="flex flex-col items-center">
          <h1 className="text-2xl md:text-3xl font-semibold mb-6 mt-4">
            Thank you for your order
          </h1>
          <div className="flex flex-col space-y-6 md:flex-row md:space-y-0 md:space-x-10 items-center justify-center">
            <div
              className={
                "w-80 h-80 md:w-[30rem] md:h-[30rem] rounded-lg flex flex-col items-center justify-center text-background bg-primary"
              }
            >
              <div className="text-center mb-10 text-foreground dark:text-background">
                {eventDisplay.id === "3733a7f4-365f-4912-bb24-33dcb58f2a19" ? (
                  <HelpingHand className="w-20 h-20 stroke-1 m-auto" />
                ) : (
                  <TicketIcon className="w-20 h-20 stroke-1 m-auto" />
                )}

                <h2 className="font-bold text-3xl md:text-5xl">
                  {eventDisplay.id === "3733a7f4-365f-4912-bb24-33dcb58f2a19"
                    ? "Thank You!"
                    : "You're Going!"}
                </h2>
              </div>
              <div className="text-center text-foreground dark:text-background">
                <p className="font-semibold text-lg md:text-2xl">
                  {eventDisplay.name}
                </p>
              </div>
            </div>

            <div className="border-[1px] border-foreground/20 rounded-lg w-80 h-80 md:w-[30rem] md:h-[30rem] m-auto flex flex-col justify-between p-3 md:p-6">
              {eventDisplay.id !== "3733a7f4-365f-4912-bb24-33dcb58f2a19" && (
                <p className="mx-auto font-semibold text-sm md:text-base text-center">
                  <span className="text-muted-foreground text-sm">
                    {quantity}x
                  </span>{" "}
                  {tInfo.name} {quantity > 1 ? "tickets" : "ticket"} added to
                  your account
                </p>
              )}

              <div className="w-52 md:w-80 mx-auto">
                <div className="aspect-w-1 aspect-h-1">
                  <Image
                    className="rounded-xl my-auto object-cover object-top"
                    alt="event poster image"
                    src={eventDisplay.publicPosterUrl}
                    width={1000}
                    height={1000}
                    priority
                  />
                </div>
              </div>
              {eventDisplay.id !== "3733a7f4-365f-4912-bb24-33dcb58f2a19" && (
                <div className="flex justify-center">
                  <Link href="/login">
                    <Button className="rounded-sm w-fit">
                      Sign up to access your tickets
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <Blurred
          posterUrl={eventDisplay.publicPosterUrl}
          opacity={0.07}
          marginX={false}
        />
      </>
    </main>
  );
}
