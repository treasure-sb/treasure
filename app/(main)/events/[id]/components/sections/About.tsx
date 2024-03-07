import { Tables } from "@/types/supabase";

export default function About({ event }: { event: Tables<"events"> }) {
  return (
    <section>
      <p className="font-semibold text-2xl">About</p>
      <p className="leading-8">{event.description}</p>
    </section>
  );
}
