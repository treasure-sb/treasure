import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import createSupabaseServerClient from "@/utils/supabase/server";
import { Tables } from "@/types/supabase";
import { validateUser } from "@/lib/actions/auth";

export default async function Tickets({ event }: { event: Tables<"events"> }) {
  const supabase = await createSupabaseServerClient();
  const { data } = await validateUser();

  return (
    <>
      <div className="bg-secondary w-full h-20 items-center rounded-md flex justify-between px-5 font-bold">
        <h1 className="text-lg">Tables from $80</h1>
        <Link
          className="h-[70%]"
          href={data.user ? `/apply?event_id=${event.id}` : "/signup"}
        >
          <Button className="bg-primary h-full w-24 rounded-md text-background text-md font-bold">
            Apply Now
          </Button>
        </Link>
      </div>
    </>
  );
}
