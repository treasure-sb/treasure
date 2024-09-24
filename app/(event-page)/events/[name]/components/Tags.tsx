"use client";

import { Badge } from "@/components/ui/badge";

export type Tag = {
  id: string;
  name: string;
};

export default function Tags({ tags }: { tags: Tag[] }) {
  return (
    tags && (
      <div className="flex gap-2 w-full flex-wrap">
        {tags.map((tag) => (
          <Badge variant={"tertiary"} className="p-1 px-4" key={tag.id}>
            {tag.name}
          </Badge>
        ))}
      </div>
    )
  );
}
