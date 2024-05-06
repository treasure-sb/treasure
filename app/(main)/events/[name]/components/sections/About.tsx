import { Tables } from "@/types/supabase";

export default function About({ event }: { event: Tables<"events"> }) {
  return (
    <section>
      <h3 className="font-semibold text-xl mb-2">About</h3>
      <p className="leading-2 whitespace-pre-line">{event.description}</p>
    </section>
  );
}
