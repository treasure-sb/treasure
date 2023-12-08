import { Tables } from "@/types/supabase";
import { useEventDisplay } from "./useEventDisplay";

export default function ListEvents({
  events,
  DisplayComponent,
  CardComponent,
}: {
  events: Tables<"events">[];
  DisplayComponent: React.FC<{ event: Tables<"events"> }>;
  CardComponent: any;
}) {
  const { mobileView, desktopView } = useEventDisplay(
    events,
    DisplayComponent,
    CardComponent
  );

  return (
    <>
      {mobileView}
      {desktopView}
    </>
  );
}
