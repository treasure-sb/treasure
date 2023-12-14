import createSupabaseServerClient from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tables } from "@/types/supabase";
import { validateUser } from "@/lib/actions/auth";
import { User } from "@supabase/supabase-js";
import { table } from "console";
import Link from "next/link";
import { getTicketTailorCheckoutUrl } from "@/lib/actions/ticket-tailor";

export default async function VendorTables({
  event,
}: {
  event: Tables<"events">;
}) {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await validateUser();
  const user = userData.user;

  let applicantData = null;
  // if (user) {
  //   const { data, error } = await supabase
  //     .from("vendor_applications")
  //     .select("*")
  //     .eq("event_id", event.id)
  //     .eq("vendor_id", user.id)
  //     .single();
  //   applicantData = data;
  // }

  // const handleApply = async () => {
  //   "use server";
  //   const {
  //     data: { user },
  //   } = await validateUser();
  //   if (!user) {
  //     redirect("/signup");
  //   }

  //   const supabase = await createSupabaseServerClient();
  //   const { data: applicationData, error } = await supabase
  //     .from("vendor_applications")
  //     .insert([
  //       {
  //         event_id: event.id,
  //         vendor_id: user.id,
  //       },
  //     ]);
  //   if (!error) {
  //     redirect("/profile/events");
  //   }
  // };

  const { data: table, error } = await supabase
    .from("tickets")
    .select("*")
    .eq("event_id", event.id)
    .eq("name", "Table")
    .single();

  let tablePrice = "100";
  if (!error) {
    tablePrice = table.price;
  }

  const checkoutURL = await getTicketTailorCheckoutUrl(
    event.ticket_tailor_event_id === null ? "" : event.ticket_tailor_event_id
  );
  console.log(checkoutURL);

  return (
    <>
      {!error && (
        <div className="bg-secondary w-full h-20 items-center rounded-md flex justify-between px-5 font-bold">
          <h1 className="text-lg">Tables from ${tablePrice}</h1>
          {/* FIXME: waiting to get rid of ticket tailor */}
          {/* {applicantData ? (
          <Button
            disabled
            className="w-24 h-[70%] rounded-md text-background text-md font-bold bg-tertiary hover:bg-tertiary"
          >
            Applied!
          </Button>
        ) : (
          <form className="h-[70%]" action={handleApply}>
            <Button className="h-full w-24 rounded-md text-background text-md font-bold">
              Apply Now
            </Button>
          </form>
        )} */}
          <Link target="_blank" href={checkoutURL}>
            <Button className="bg-primary h-[70%] w-24 rounded-md text-background text-md font-bold py-4 px-4">
              Buy Now
            </Button>
          </Link>
        </div>
      )}
    </>
  );
}
