import createSupabaseServerClient from "@/utils/supabase/server";
import Image from "next/image";
import { Tables } from "@/types/supabase";
import { getPublicPosterUrl } from "@/lib/helpers/events";
import * as z from "zod";
import { validateUser } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

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

  const event: Tables<"events"> = eventData;
  const publicPosterUrl = await getPublicPosterUrl(event);

  return (
    <main className="w-full lg:w-fit m-auto">
      <div className="mt-10 flex flex-col lg:flex-row lg:space-x-10">
        <div className="lg:max-w-lg">
          <Image
            className="rounded-xl mb-6 lg:mb-0 m-auto lg:sticky lg:top-10"
            alt="event poster image"
            src={publicPosterUrl}
            width={500}
            height={500}
          />
        </div>
        <div className="flex flex-col text-left max-w-lg lg:max-w-xl mx-auto space-y-8">
          <h1 className="text-4xl font-semibold">
            {event.name} Vendor Application
          </h1>
        </div>
      </div>
    </main>
  );
}
