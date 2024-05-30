import React, { useState } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tables } from "@/types/supabase";

interface tagsInputProps {
  initialTags?: Tables<"tags">[];
  allTags: Tables<"tags">[];
  onTagsChange: (tags: Tables<"tags">[]) => void;
}

const TagInput: React.FC<tagsInputProps> = ({
  initialTags = [],
  allTags = [],
  onTagsChange,
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const initialTagNames = new Set(
    initialTags.map((tag) => tag.name.toLocaleLowerCase())
  );
  const filteredTags = allTags.filter((tag) => {
    const tagNameLower = tag.name.toLocaleLowerCase();
    return (
      tagNameLower.includes(inputValue.toLocaleLowerCase()) &&
      !initialTagNames.has(tagNameLower)
    );
  });

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (filteredTags.length === 1) {
        const newTags = [...initialTags, filteredTags[0]];
        onTagsChange(newTags);
        setInputValue("");
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleTagAdd = (tag: Tables<"tags">) => {
    const newTags = [...initialTags, tag];
    onTagsChange(newTags);
  };

  const removeKeyword = (indexToRemove: number) => {
    const newtags = initialTags.filter((_, index) => index !== indexToRemove);
    onTagsChange(newtags);
  };

  return (
    <div>
      <div
        className="flex flex-wrap gap-2 overflow-y-auto items-center"
        style={{ maxHeight: "300px" }}
      >
        {initialTags.map((keyword, index) => (
          <Badge
            key={index}
            onClick={() => removeKeyword(index)}
            variant={"eventTag"}
            className="cursor-pointer"
          >
            {keyword.name}
            <X size={14} className="ml-2 cursor-pointer" />
          </Badge>
        ))}
        <Input
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="my-1 flex-1 text-base placeholder:text-sm outline-none border-none"
          placeholder="Search for tags..."
        />
      </div>
      <div className="flex space-x-2 mt-2">
        <p className="font-semibold">Tags:</p>
        <div className="flex gap-2 flex-wrap scrollbar-hidden">
          {filteredTags.map((tag) => (
            <Badge
              variant={"secondary"}
              className="flex-shrink-0 hover:cursor-pointer"
              onClick={() => handleTagAdd(tag)}
              key={tag.id}
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TagInput;
