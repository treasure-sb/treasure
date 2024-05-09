import { type TagData } from "@/app/(dashboards)/host/events/[eventName]/vendors/types";
import { Button } from "@/components/ui/button";

export default function VendorFilter({ tags }: { tags: TagData[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      <Button
        className="text-xs p-2 h-6 text-foreground underline decoration-primary"
        variant={"link"}
      >
        All
      </Button>
      {tags.map(({ tags }) => (
        <Button className="text-xs p-2 h-6 text-foreground" variant={"link"}>
          {tags.name}
        </Button>
      ))}
    </div>
  );
}
