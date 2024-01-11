"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function SeeMore({ children }: { children: React.ReactNode[] }) {
  const [screenSize, setScreenSize] = useState("desktop");
  const [end, setEnd] = useState(6);
  const [endRef, setEndRef] = useState(0);

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width > 1024) {
        setScreenSize("desktop");
        setEnd(6);
        setEndRef(6);
      } else if (width > 768 && width <= 1024) {
        setScreenSize("tablet");
        setEnd(4);
        setEndRef(4);
      } else {
        setScreenSize("mobile");
        setEnd(3);
        setEndRef(3);
      }
    };

    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  const step = screenSize === "desktop" ? 3 : 2;

  return (
    <>
      {children.slice(0, end)}
      {end < children.length && (
        <div
          style={{
            background:
              "linear-gradient(to top, hsl(20 14.3% 4.1%) 20%, transparent 100%)",
          }}
          className="w-full h-40 md:h-[50%] absolute bottom-0"
        />
      )}
      <div className="flex justify-center items-center md:absolute md:bottom-0 w-full">
        {end < children.length && (
          <>
            <Button
              variant={"ghost"}
              className="z-10 w-full"
              onClick={() => setEnd(end + step)}
            >
              See More
            </Button>
          </>
        )}
        {end > endRef && (
          <Button
            className="z-10 w-full"
            variant={"ghost"}
            onClick={() => setEnd(end - step)}
          >
            See Less
          </Button>
        )}
      </div>
    </>
  );
}
