import AnalyticsCard from "./AnalyticsCard";
import createSupabaseServerClient from "@/utils/supabase/server";

export default async function Page({ params }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient();
  const { data: ticketsData, error } = await supabase
    .from("tickets")
    .select("*")
    .eq("event_id", params.id);

  return (
    <main className="m-auto max-w-lg">
      <div className="flex flex-col w-full space-y-4">
        {ticketsData &&
          ticketsData.map((ticket) => (
            <AnalyticsCard
              ticket={ticket}
              sold={Math.round(ticket.quantity * 0.6)}
            />
          ))}
      </div>
    </main>
  );
}
