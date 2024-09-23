"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useViewportSize } from "@mantine/hooks";

const MAX_CHARS_MOBILE = 400;

export default function About({ description }: { description: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { width } = useViewportSize();

  useEffect(() => {
    setIsClient(true);
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    if (isClient) {
      setIsMobile(width < 768);
    }
  }, [width, isClient]);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const shouldTruncate = isMobile && description.length > MAX_CHARS_MOBILE;
  const displayText =
    !isMobile || isExpanded || !shouldTruncate
      ? description
      : `${description.slice(0, MAX_CHARS_MOBILE)}...`;

  if (!isClient) {
    return (
      <section className="overflow-hidden">
        <h3 className="font-semibold text-lg mb-2">About</h3>
        <p className="leading-2 whitespace-pre-line text-sm md:text-base text-foreground/80">
          {description}
        </p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden">
      <h3 className="font-semibold text-lg mb-2">About</h3>
      <div className="relative">
        <p
          className={`leading-2 whitespace-pre-line text-sm md:text-base text-foreground/80 ${
            isMobile && !isExpanded && shouldTruncate
              ? "max-h-[12em] overflow-hidden"
              : ""
          } ${!displayText ? "italic" : ""}`}
        >
          {displayText ? displayText : "No description provided"}
        </p>
        {isMobile && shouldTruncate && !isExpanded && (
          <div
            onClick={toggleExpand}
            className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background via-background/60 to-transparent cursor-pointer"
          ></div>
        )}
      </div>
      {isMobile && shouldTruncate && (
        <div className="flex items-center justify-center">
          <Button
            variant="link"
            onClick={toggleExpand}
            className="mt-2 p-0 h-auto font-normal text-muted-foreground hover:no-underline"
          >
            {isExpanded ? "See Less" : "See All"}
          </Button>
        </div>
      )}
    </section>
  );
}
