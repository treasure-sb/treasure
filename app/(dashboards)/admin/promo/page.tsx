import { Tables } from "@/types/supabase";
import { DataTable } from "./table/DataTable";
import { PromoCode, promoColumns } from "./table/PromoDataColumns";
import createSupabaseServerClient from "@/utils/supabase/server";

type PromoData = Tables<"event_codes"> & { event: Tables<"events"> | null };

export default async function PromoCodes() {
  const supabase = await createSupabaseServerClient();
  const { data: promoData, error } = await supabase
    .from("event_codes")
    .select("*, event:events(*)")
    .eq("treasure_sponsored", true);

  const { data: eventsData, error: eventError } = await supabase
    .from("events")
    .select("*");

  const events: Tables<"events">[] = eventsData || [];

  const promoCodes: PromoData[] = promoData || [];

  const tableData: PromoCode[] = promoCodes.map((promoCode) => {
    return {
      id: promoCode.id,
      code: promoCode.code,
      discount: {
        amount: promoCode.discount,
        type: promoCode.type,
      },
      status: promoCode.status,
      num_used: promoCode.num_used,
      usage_limit: promoCode.usage_limit,
      created_at: new Date(promoCode.created_at),
      event: promoCode.event
        ? promoCode.event?.name + " (" + promoCode.event?.min_date + ")"
        : "Global (All Events)",
    };
  });

  return (
    <>
      <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:justify-between mb-4">
        <h2 className="text-2xl font-semibold">Promo Codes</h2>
      </div>
      <DataTable columns={promoColumns} data={tableData} events={events} />
    </>
  );
}
