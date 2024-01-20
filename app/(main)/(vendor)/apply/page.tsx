import createSupabaseServerClient from "@/utils/supabase/server";
import Image from "next/image";
import { Tables } from "@/types/supabase";
import { getPublicPosterUrl } from "@/lib/helpers/events";
import * as z from "zod";
import { validateUser } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import ApplicationForm from "./ApplicationForm";

export default async function Page({
  searchParams: { event_id },
}: {
  searchParams: { event_id: string };
}) {
  const { data } = await validateUser();
  if (!data.user) {
    redirect("/signup");
  }

  const supabase = await createSupabaseServerClient();
  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("id", event_id)
    .single();

  const { data: eventTerms, error: termsError } = await supabase
    .from("application_terms_and_conditions")
    .select("*")
    .eq("event_id", event_id);

  const event: Tables<"events"> = eventData;
  const terms: Tables<"application_terms_and_conditions">[] = eventTerms
    ? eventTerms
    : [];
  const publicPosterUrl = await getPublicPosterUrl(event);

  return (
    <main className="w-full m-auto">
      <div className="flex-col flex space-y-4 w-full max-w-screen-lg mx-auto">
        <div className=" flex flex-row lg:space-x-10 justify-center">
          <div className="sm:max-w-lg">
            <Image
              className="rounded-xl lg:mb-0 m-auto lg:sticky lg:top-10"
              alt="event poster image"
              src={publicPosterUrl}
              width={150}
              height={150}
            />
          </div>
          <div className="my-auto">
            <h1 className="text-xl font-semibold ">{event.name}</h1>
            <h2 className="text-base">Vendor Application</h2>
          </div>
        </div>
        <ApplicationForm
          toc={terms}
          comment={event.comment}
          event_id={event.id}
        />
      </div>
    </main>
  );
}
