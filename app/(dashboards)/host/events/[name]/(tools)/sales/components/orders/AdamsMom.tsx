import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import createSupabaseServerClient from "@/utils/supabase/server";
import { Tables } from "@/types/supabase";

type SampaMetadata = {
  dinnerSelections: string[];
  isSampa: boolean;
};

export default async function AdamsMom({ eventId }: { eventId: string }) {
  const supabase = await createSupabaseServerClient();

  const { data: orderData, error: fullTicketError } = await supabase
    .from("orders")
    .select("*")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });

  let allOrders: Tables<"orders">[] = orderData ? orderData : [];

  let dinnerCount = { chicken: 0, steak: 0, salmon: 0 };
  allOrders?.map((order) => {
    (order.metadata as SampaMetadata).dinnerSelections?.map((dinner) => {
      dinner.includes("Chicken")
        ? (dinnerCount.chicken += parseInt(dinner.split(" ")[0]))
        : dinner.includes("Steak")
        ? (dinnerCount.steak += parseInt(dinner.split(" ")[0]))
        : (dinnerCount.salmon += parseInt(dinner.split(" ")[0]));
    });
  });

  return (
    <>
      <div className="my-6 flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Dinner Selections</h1>
        <div className="border rounded-sm max-w-sm">
          <Table>
            <TableBody>
              <TableRow className="hover:bg-background">
                <TableCell>Chicken Dinners</TableCell>
                <TableCell>{dinnerCount.chicken}</TableCell>
              </TableRow>
              <TableRow className="hover:bg-background">
                <TableCell>Steak Dinners</TableCell>
                <TableCell>{dinnerCount.steak}</TableCell>
              </TableRow>
              <TableRow className="hover:bg-background">
                <TableCell>Salmon Dinners</TableCell>
                <TableCell>{dinnerCount.salmon}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
