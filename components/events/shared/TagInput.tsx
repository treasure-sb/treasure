import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tables } from "@/types/supabase";
import { Separator } from "@/components/ui/separator";

interface tagsInputProps {
  initialTags?: Tables<"tags">[] | string[];
  allTags: Tables<"tags">[] | string[];
  onTagsChange: (tags: any) => void;
}

const TagInput: React.FC<tagsInputProps> = ({
  initialTags = [],
  allTags = [],
  onTagsChange,
}) => {
  const isString = (tag: Tables<"tags"> | string): tag is string =>
    typeof tag === "string";

  const [inputValue, setInputValue] = useState<string>("");
  const initialTagNames = new Set(
    initialTags.map((tag) =>
      isString(tag) ? tag : tag.name.toLocaleLowerCase()
    )
  );

  const filteredTags = allTags.filter((tag) => {
    const tagNameLower = isString(tag)
      ? tag.toLocaleLowerCase()
      : tag.name.toLocaleLowerCase();
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

  const handleTagAdd = (tag: Tables<"tags"> | string) => {
    const newTags = [...initialTags, tag];
    onTagsChange(newTags);
  };

  const removeKeyword = (indexToRemove: number) => {
    const newtags = initialTags.filter((_, index) => index !== indexToRemove);
    onTagsChange(newtags);
  };

  return (
    <div>
      <div className="space-y-3">
        <div
          className="flex flex-wrap gap-2 overflow-y-auto items-center"
          style={{ maxHeight: "300px" }}
        >
          {initialTags.map((keyword, index) => (
            <Badge
              key={index}
              onClick={() => removeKeyword(index)}
              variant={"tertiary"}
              className="cursor-pointer"
            >
              {isString(keyword) ? keyword : keyword.name}
              <X size={14} className="ml-2 cursor-pointer" />
            </Badge>
          ))}
        </div>
        <div className="px-3 flex items-center bg-field rounded-sm">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            type="text"
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="flex-1 text-base h-fit placeholder:text-sm outline-none border-none px-0"
            placeholder="Search for tags or select from below..."
          />
        </div>
      </div>
      <Separator className="my-4" />
      <div className="flex space-x-2 mt-2">
        <div className="flex gap-2 flex-wrap scrollbar-hidden">
          {filteredTags.map((tag, index) => (
            <Badge
              variant={"tertiary"}
              className="flex-shrink-0 hover:cursor-pointer opacity-60"
              onClick={() => handleTagAdd(tag)}
              key={index}
            >
              {isString(tag) ? tag : tag.name}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TagInput;
