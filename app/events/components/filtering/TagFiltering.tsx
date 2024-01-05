"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

/**
 * A React component for filtering events based on predefined tags. It displays a series of buttons, each representing a tag.
 *
 * State:
 * - activeTag: String that represents the currently active tag for filtering.
 *
 * Behavior:
 * - Updates the active tag based on user interaction.
 * - Modifies the URL query parameters to reflect the selected tag.
 * - Resets the active tag when the same tag is clicked again or when a different tag is chosen.
 *
 * Usage:
 * - Renders buttons for each tag in the predefined list.
 * - Applies different styles based on the active tag.
 *
 * @returns {JSX.Element} - A rendered element containing buttons for each tag with their respective event handling.
 */
export default function TagFiltering() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [activeTag, setActiveTag] = useState<string>("");
  const { replace } = useRouter();

  useEffect(() => {
    setActiveTag(searchParams.get("tag") || "");
  }, [searchParams]);

  const handleClick = (tag_name: string) => {
    const params = new URLSearchParams(searchParams);
    if (tag_name === activeTag) {
      setActiveTag("");
      params.delete("tag");
    } else {
      setActiveTag(tag_name);
      params.set("tag", tag_name);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const tags = [
    "Pokemon",
    "Sports",
    "Comics",
    "Toys",
    "Memorabilia",
    "Collectibles",
    "Autographs",
    "Non-Sports",
  ];

  return (
    <div className="flex space-x-2 overflow-scroll scrollbar-hidden mb-2">
      {tags?.map((tag, i) => (
        <Button
          key={i}
          onClick={() => handleClick(tag)}
          variant={"outline"}
          className={`${
            tag === activeTag
              ? "bg-tertiary text-black border-tertiary hover:bg-tertiary/90 hover:text-black font-semibold"
              : "font-medium hover:bg-background md:hover:bg-secondary"
          }`}
        >
          {tag}
        </Button>
      ))}
    </div>
  );
}
