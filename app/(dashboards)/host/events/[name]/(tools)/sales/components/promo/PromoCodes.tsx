import { Tables } from "@/types/supabase";
import { DataTable } from "./table/DataTable";
import { PromoCode, promoColumns } from "./table/PromoDataColumns";
import createSupabaseServerClient from "@/utils/supabase/server";
import { EventWithDates } from "@/types/event";

export default async function PromoCodes({ event }: { event: EventWithDates }) {
  const supabase = await createSupabaseServerClient();
  const { data: promoData } = await supabase
    .from("event_codes")
    .select("*")
    .eq("event_id", event.id);

  const promoCodes: Tables<"event_codes">[] = promoData || [];

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
    };
  });

  return (
    <>
      <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:justify-between mb-4">
        <h2 className="text-2xl font-semibold">Promo Codes</h2>
      </div>
      <DataTable columns={promoColumns} data={tableData} event={event} />
    </>
  );
}
