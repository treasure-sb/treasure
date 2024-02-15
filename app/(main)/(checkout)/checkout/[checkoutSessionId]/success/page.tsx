import InitializePaymentIntent from "./components/InitializePaymentIntent";
import createSupabaseServerClient from "@/utils/supabase/server";
import { getEventDisplayData } from "@/lib/helpers/events";
import { Tables } from "@/types/supabase";
import { redirect } from "next/navigation";

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
      .select("*")
      .eq("id", checkoutSessionId)
      .single();

  if (checkoutSessionError) {
    redirect("/events");
  }

  const checkoutSession: Tables<"checkout_sessions"> = checkoutSessionData;
  const { event_id } = checkoutSession;
  const { data: eventData } = await supabase
    .from("events")
    .select("*")
    .eq("id", event_id)
    .single();
  const event: Tables<"events"> = eventData;
  const eventDisplay = await getEventDisplayData(event);

  return (
    <main className="max-w-6xl m-auto">
      <InitializePaymentIntent eventDisplay={eventDisplay} />
    </main>
  );
}
