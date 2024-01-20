import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

  const { data: tables, error } = await supabase
    .from("tables")
    .select("*")
    .eq("event_id", event.id)
    .order("price", { ascending: true });

  const cheapestTable = tables?.reduce((prev: any, cur: any) => {
    return prev.price < cur.price ? prev : cur;
  }, 0);

  const hasStripePriceId = tables ? tables[0].stripe_price_id : false;

  return (
    <>
      {tables && tables.length > 0 ? (
        <div className="bg-secondary w-full h-20 items-center rounded-md flex justify-between px-5 font-bold">
          <h1 className="text-lg">Tables From ${cheapestTable.price}</h1>
          {tables && tables.length > 1 ? (
            <>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-primary h-[70%] w-24 text-background text-md font-bold px-14">
                    View All
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-2xl p-4 mb-6 text-center border-b-2">
                      Tables
                    </DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col space-y-4">
                    {tables?.map((table: Tables<"tables">) => (
                      <div
                        key={table.id}
                        className="flex justify-between items-center"
                      >
                        <div>
                          <h1 className="font-semibold text-xl">
                            {table.section_name} ${table.price}
                          </h1>
                        </div>
                        {(event.sales_status === "TABLES_ONLY" ||
                          event.sales_status === "SELLING_ALL") &&
                          (event.vendor_exclusivity === "PUBLIC" ? (
                            <>
                              {hasStripePriceId && (
                                <Link
                                  href={`/checkout?price_id=${tables[0].stripe_price_id}&user_id=${user?.id}&event_id=${event.id}&ticket_id=${tables[0].id}&quantity=1`}
                                >
                                  <Button className="bg-primary h-[70%] w-24 text-background text-md font-bold px-14 py-4">
                                    Buy Now
                                  </Button>
                                </Link>
                              )}
                            </>
                          ) : (
                            <Link
                              href={{
                                pathname: `/apply`,
                                query: { event_id: event.id },
                              }}
                            >
                              <Button className="bg-primary h-[70%] w-24 text-background text-md font-bold px-14 py-4">
                                Apply Now
                              </Button>
                            </Link>
                          ))}
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <>
              {(event.sales_status === "TABLES_ONLY" ||
                event.sales_status === "SELLING_ALL") &&
                (event.vendor_exclusivity === "PUBLIC" ? (
                  <>
                    {hasStripePriceId && (
                      <Link
                        href={`/checkout?price_id=${tables[0].stripe_price_id}&user_id=${user?.id}&event_id=${event.id}&ticket_id=${tables[0].id}&quantity=1`}
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
            </>
          )}
        </div>
      ) : null}
    </>
  );
}
