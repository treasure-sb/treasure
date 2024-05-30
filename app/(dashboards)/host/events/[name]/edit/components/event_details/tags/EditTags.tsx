import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { PencilIcon, EyeIcon } from "lucide-react";
import TagInput from "./TagInput";

export default function EditTags({ tags }: { tags: string[] }) {
  const [edit, setEdit] = useState(false);

  return edit ? (
    <div>
      <TagInput initialTags={tags} />
      <EyeIcon
        size={22}
        className="text-foreground/30 hover:text-foreground transition duration-500 hover:cursor-pointer"
        onClick={() => setEdit(false)}
      />
    </div>
  ) : (
    <div className="flex gap-2 w-full flex-wrap">
      {tags.map((tag) => (
        <Badge variant={"eventTag"} key={tag}>
          {tag}
        </Badge>
      ))}
      <PencilIcon
        size={20}
        onClick={() => setEdit(true)}
        className="text-foreground/30 hover:text-foreground transition duration-500 hover:cursor-pointer"
      />
    </div>
  );
}
