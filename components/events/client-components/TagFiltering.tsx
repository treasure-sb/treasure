"use client";

import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import { Tables } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function TagFiltering() {
  const supabase = createClient();
  const [tags, setTags] = useState<Tables<"tags">[] | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [activeTag, setActiveTag] = useState<string>("");
  const { replace, refresh } = useRouter();

  useEffect(() => {
    const fetchTags = async () => {
      const { data, error } = await supabase.from("tags").select("*");
      if (data) {
        const dbTags: Tables<"tags">[] = data;
        setTags(dbTags);
      }
      setLoading(false);
    };
    setActiveTag(searchParams.get("query") || "");
    fetchTags();
  }, []);

  const handleClick = (tag_name: string) => {
    const params = new URLSearchParams(searchParams);
    if (tag_name === activeTag) {
      setActiveTag("");
      params.delete("query");
    } else if (tag_name) {
      setActiveTag(tag_name);
      params.set("query", tag_name);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex space-x-2 overflow-scroll scrollbar-hidden mb-2">
      {loading && (
        <>
          <Skeleton className="w-full h-10 rounded-sm" />
          <Skeleton className="w-full h-10 rounded-sm" />
          <Skeleton className="w-full h-10 rounded-sm" />
          <Skeleton className="w-full h-10 rounded-sm" />
        </>
      )}
      {tags?.map((tag) => (
        <Button
          onClick={() => handleClick(tag.name)}
          variant={tag.name === activeTag ? "default" : "secondary"}
        >
          {tag.name}
        </Button>
      ))}
    </div>
  );
}