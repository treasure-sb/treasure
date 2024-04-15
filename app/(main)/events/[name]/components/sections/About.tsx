import { Tables } from "@/types/supabase";

export default function About({ event }: { event: Tables<"events"> }) {
  return (
    <section>
      <p className="font-semibold text-xl mb-4">About</p>
      <p className="leading-7 whitespace-pre-line">{event.description}</p>
    </section>
  );
}
