import createSupabaseServerClient from "@/utils/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tables } from "@/types/supabase";
import { validateUser } from "@/lib/actions/auth";

export default async function VendorTables({
  event,
}: {
  event: Tables<"events">;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await validateUser();

  const { data: table, error } = await supabase
    .from("tickets")
    .select("*")
    .eq("event_id", event.id)
    .eq("name", "Table")
    .single();

  const tablePrice = table?.price || 0;
  const hasStripePriceId = table?.stripe_price_id;

  return (
    <>
      {!error && (
        <div className="bg-secondary w-full h-20 items-center rounded-md flex justify-between px-5 font-bold">
          <h1 className="text-lg">Tables from ${tablePrice}</h1>
          {event.tickets_status > 0 &&
            (event.table_public === 0 ? (
              <>
                {hasStripePriceId && (
                  <Link
                    href={`/checkout?price_id=${table.stripe_price_id}&user_id=${user?.id}&event_id=${event.id}&ticket_id=${table.id}&quantity=1`}
                  >
                    <Button className="bg-primary h-[70%] w-24 text-background text-md font-bold px-14 py-4">
                      Buy Now
                    </Button>
                  </Link>
                )}
              </>
            ) : (
              <Link
                href={{ pathname: `/apply`, query: { event_id: event.id } }}
              >
                <Button className="bg-primary h-[70%] w-24 text-background text-md font-bold px-14 py-4">
                  Apply Now
                </Button>
              </Link>
            ))}
        </div>
      )}
    </>
  );
}
