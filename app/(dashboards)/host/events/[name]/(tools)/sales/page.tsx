import { redirect } from "next/navigation";
import { Tables } from "@/types/supabase";
import createSupabaseServerClient from "@/utils/supabase/server";
import TabState from "./components/TabState";
import Orders from "./components/orders/Orders";

export default async function Page({
  params: { name },
  searchParams: { from, to },
}: {
  params: { name: string };
  searchParams: { from?: string; to?: string };
}) {
  const supabase = await createSupabaseServerClient();

  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("cleaned_name", name)
    .single();

  if (eventError) {
    redirect("/host/events");
  }

  const event: Tables<"events"> = eventData;

  return (
    <div className="max-w-7xl mx-auto">
      <TabState>
        <Orders event={event} from={from} to={to} />
        <div>
          <h3>Promo Codes</h3>
        </div>
      </TabState>
    </div>
  );
}
