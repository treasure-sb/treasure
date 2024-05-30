import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { PencilIcon, EyeIcon } from "lucide-react";
import { Tables } from "@/types/supabase";
import TagInput from "./TagInput";

export default function EditTags({
  allTags,
  selectedTags,
  handleTagsChange,
}: {
  allTags: Tables<"tags">[];
  selectedTags: Tables<"tags">[];
  handleTagsChange: (tag: Tables<"tags">[]) => void;
}) {
  const [edit, setEdit] = useState(false);

  return edit ? (
    <div>
      <TagInput
        onTagsChange={handleTagsChange}
        initialTags={selectedTags}
        allTags={allTags}
      />
      <div className="flex justify-end">
        <EyeIcon
          size={22}
          className="text-foreground/30 hover:text-foreground transition duration-500 hover:cursor-pointer my-auto"
          onClick={() => setEdit(false)}
        />
      </div>
    </div>
  ) : (
    <div className="flex gap-2 w-full flex-wrap">
      {selectedTags.map((tag) => (
        <Badge variant={"eventTag"} key={tag.id}>
          {tag.name}
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
