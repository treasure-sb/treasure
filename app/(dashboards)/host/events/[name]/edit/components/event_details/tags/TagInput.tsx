import React, { useState } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface tagsInputProps {
  initialTags?: string[];
  onTagsChange?: (tags: string[]) => void;
}

const TagInput: React.FC<tagsInputProps> = ({
  initialTags = [],
  onTagsChange,
}) => {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputValue, setInputValue] = useState<string>("");

  // Handles adding new keyword on Enter or comma press, and keyword removal on Backspace
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      (event.key === "Enter" || event.key === ",") &&
      inputValue.trim() !== ""
    ) {
      event.preventDefault();
      const newTags = [...tags, inputValue.trim()];
      setTags(newTags);
      // onTagsChange(newTags);
      setInputValue("");
    } else if (event.key === "Backspace" && inputValue === "") {
      event.preventDefault();
      const newTags = tags.slice(0, -1);
      setTags(newTags);
      onTagsChange(newTags);
    }
  };

  // Handles pasting tags separated by commas, new lines, or tabs
  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const paste = event.clipboardData.getData("text");
    const tagsToAdd = paste
      .split(/[\n\t,]+/)
      .map((keyword) => keyword.trim())
      .filter(Boolean);
    if (tagsToAdd.length) {
      const newTags = [...tags, ...tagsToAdd];
      setTags(newTags);
      // onTagsChange(newTags);
      setInputValue("");
    }
  };

  // Updates the inputValue state as the user types
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
  // Adds the keyword when the input loses focus, if there's a keyword to add
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (inputValue.trim() !== "" && event.relatedTarget?.tagName !== "BUTTON") {
      const newTags = [...tags, inputValue.trim()];
      setTags(newTags);
      // onTagsChange(newTags);
      setInputValue("");
    }
  };

  // Removes a keyword from the list
  const removeKeyword = (indexToRemove: number) => {
    const newtags = tags.filter((_, index) => index !== indexToRemove);
    setTags(newtags);
    // onTagsChange(newtags);
  };

  return (
    <div className="flex w-full flex-wrap items-center rounded-lg p-2">
      <div
        className="flex w-full flex-wrap gap-2 overflow-y-auto"
        style={{ maxHeight: "300px" }}
      >
        {tags.map((keyword, index) => (
          <Badge
            key={index}
            onClick={() => removeKeyword(index)}
            variant={"eventTag"}
            className="cursor-pointer"
          >
            {keyword}
            <X size={14} className="ml-2 cursor-pointer" />
          </Badge>
        ))}
        <Input
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onBlur={(e) => handleBlur(e)}
          className="my-1 flex-1 text-sm outline-none border-none"
          placeholder="Search for tags..."
        />
      </div>
    </div>
  );
};

export default TagInput;
