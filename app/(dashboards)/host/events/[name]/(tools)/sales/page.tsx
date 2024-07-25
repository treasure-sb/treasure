import { redirect } from "next/navigation";
import { Tables } from "@/types/supabase";
import createSupabaseServerClient from "@/utils/supabase/server";
import TabState from "./components/TabState";
import Orders from "./components/orders/Orders";
import PromoCodes from "./components/promo/PromoCodes";
import { getEventFromCleanedName } from "@/lib/helpers/events";

export default async function Page({
  params: { name },
  searchParams: { from, to },
}: {
  params: { name: string };
  searchParams: { from?: string; to?: string };
}) {
  const supabase = await createSupabaseServerClient();

  const { event, eventError } = await getEventFromCleanedName(name);

  if (eventError) {
    redirect("/host/events");
  }

  return (
    <div className="max-w-7xl mx-auto">
      <TabState>
        <Orders event={event} from={from} to={to} />
        <PromoCodes event={event} />
      </TabState>
    </div>
  );
}
