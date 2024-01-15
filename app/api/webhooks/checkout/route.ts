import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { Tables } from "@/types/supabase";
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

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const { user_id, event_id, ticket_id, quantity } = JSON.parse(
        JSON.stringify(session.metadata)
      );
      const order: Tables<"orders"> = await generateOrder(user_id);
      const ticketsToInsert = Array.from({ length: quantity }, () => ({
        attendee_id: user_id,
        event_id,
        ticket_id,
        order_id: order.id,
      }));
      await supabase.from("event_tickets").insert(ticketsToInsert);
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
