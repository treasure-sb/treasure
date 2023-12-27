import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getTicketTailorCheckoutUrl } from "@/lib/actions/ticket-tailor";
import { Tables } from "@/types/supabase";
import { validateUser } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { User } from "@supabase/supabase-js";
import createSupabaseServerClient from "@/utils/supabase/server";
import Link from "next/link";

export default async function Tickets({
  event,
  user,
}: {
  event: Tables<"events">;
  user: User | null;
}) {
  const supabase = await createSupabaseServerClient();
  const { data: tickets, error: ticketError } = await supabase
    .from("tickets")
    .select("*")
    .eq("event_id", event.id)
    .neq("name", "Table");

  const cheapestTicket = tickets?.reduce((prev: any, cur: any) => {
    return prev.price < cur.price ? prev : cur;
  }, 0);

  // check to see if user is attending, if they are then show button as attending
  const { data: attendingData, error: attendingError } = await supabase
    .from("event_guests")
    .select("*")
    .eq("event_id", event.id)
    .eq("guest_id", user?.id)
    .select();

  const handleAttending = async () => {
    "use server";
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await validateUser();
    if (!user) {
      redirect("/login");
    }

    await supabase
      .from("event_guests")
      .insert([{ guest_id: user.id, event_id: event.id }]);
    revalidatePath(`/events/${event.cleaned_name}`);
  };

  return (
    <>
      {tickets && tickets.length > 0 ? (
        <div className="bg-secondary w-full h-20 items-center rounded-md flex justify-between px-5 font-bold">
          <h1 className="text-lg">Tickets From ${cheapestTicket.price}</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary h-[70%] w-24 text-background text-md font-bold px-14">
                View All
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-2xl p-4 mb-6 text-center border-b-2">
                  Tickets
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col space-y-4">
                {tickets?.map((ticket: any) => (
                  <div
                    key={ticket.id}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <h1 className="font-semibold text-xl">
                        {ticket.name} ${ticket.price}
                      </h1>
                    </div>
                    {/* <Link target="_blank" href={""}>
                      <Button>Buy Now!</Button>
                    </Link> */}
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          {/* {attendingData && attendingData.length > 0 ? (
            <Button className="bg-tertiary h-[70%] w-fit text-background text-md font-bold hover:bg-tertiary/90 cursor-default">
              Attending
            </Button>
          ) : (
            <form action={handleAttending} className="h-[70%]">
              <Button className="bg-primary h-full w-fit text-background text-md font-bold">
                Mark as Attending
              </Button>
            </form>
          )} */}
        </div>
      ) : (
        <h1>No Tickets</h1>
      )}
    </>
  );
}
