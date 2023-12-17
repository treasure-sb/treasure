"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function TagFiltering() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [activeTag, setActiveTag] = useState<string>("");
  const { replace } = useRouter();

  useEffect(() => {
    setActiveTag(searchParams.get("tag") || "");
  }, []);

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
          variant={tag === activeTag ? "default" : "secondary"}
        >
          {tag}
        </Button>
      ))}
    </div>
  );
}
