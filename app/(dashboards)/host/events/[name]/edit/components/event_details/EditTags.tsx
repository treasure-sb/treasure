import { Badge } from "@/components/ui/badge";

export default function EditTags({ tags }: { tags: string[] }) {
  return (
    <div className="flex gap-2 w-full flex-wrap">
      {tags.map((tag) => (
        <Badge
          className="bg-tertiary p-1 px-4 hover:bg-tertiary text-background"
          key={tag}
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
}
