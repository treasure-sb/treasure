import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { sendTicketPurchasedEmail } from "@/lib/actions/emails";
import { getPublicPosterUrl } from "@/lib/helpers/events";
import { getProfile } from "@/lib/helpers/profiles";
import { getEventFromId } from "@/lib/helpers/events";
import { Tables } from "@/types/supabase";
import moment from "moment";
import createSupabaseServerClient from "@/utils/supabase/server";
import Cors from "micro-cors";
import Stripe from "stripe";

const cors = Cors({
  allowMethods: ["POST", "HEAD"],
});

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string);
const webhookSecret = process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET as string;

const generateOrder = async (user_id: string) => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("orders")
    .insert([{ user_id }])
    .select();

  if (error) {
    return NextResponse.json({
      message: "Error",
      ok: false,
    });
  }
  return data[0];
};

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const supabase = await createSupabaseServerClient();
    const signature = headers().get("stripe-signature") as string;
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    if (event.type === "payment_intent.succeeded") {
      const session = event.data.object;
      const { checkoutSessionId } = JSON.parse(
        JSON.stringify(session.metadata)
      );

      const { data: checkoutSessionData, error: checkoutSessionError } =
        await supabase
          .from("checkout_sessions")
          .select("*")
          .eq("id", checkoutSessionId)
          .single();

      if (checkoutSessionError) {
        return NextResponse.json({
          message: "Invalid checkout session",
          ok: false,
        });
      }

      const checkoutSession: Tables<"checkout_sessions"> = checkoutSessionData;
      const { event_id, ticket_id, user_id, quantity } = checkoutSession;

      // not a good way to do this, but it's a quick solution to know what kind of
      // ticket was purchased (actual solution: need to construct payload for checkout session)
      const { data: ticketData } = await supabase
        .from("tickets")
        .select("*")
        .eq("id", ticket_id)
        .single();
      const ticket: Tables<"tickets"> = ticketData;

      if (ticket.id) {
        const { data: purchasedTicketData, error: purchasedTicketError } =
          await supabase
            .from("event_tickets")
            .insert({ attendee_id: user_id, event_id, ticket_id })
            .select();

        if (!purchasedTicketData || purchasedTicketError) {
          return NextResponse.json({
            message: "Error",
            ok: false,
          });
        }

        const purchasedTicket: Tables<"event_tickets"> = purchasedTicketData[0];
        const { profile } = await getProfile(user_id);
        const { event } = await getEventFromId(event_id);
        const posterUrl = await getPublicPosterUrl(event);

        // generate emails props
        const emailProps = {
          eventName: event.name,
          posterUrl,
          ticketType: ticket.name,
          quantity: quantity,
          location: event.address,
          date: moment(event.date).format("dddd, MMM Do"),
          guestName: `${profile.first_name} ${profile.last_name}`,
          totalPrice: `$${ticketData.price}`,
          eventInfo: event.description,
        };

        await sendTicketPurchasedEmail(
          profile.email,
          purchasedTicket.id,
          event_id,
          emailProps
        );
      } else {
        await supabase
          .from("event_vendors")
          .update({ payment_status: "PAID" })
          .eq("event_id", event_id)
          .eq("vendor_id", user_id);
      }
    }

    return NextResponse.json({
      result: event,
      ok: true,
    });
  } catch (err) {
    return NextResponse.json(
      {
        message: "Error",
        ok: false,
      },
      { status: 500 }
    );
  }
}
