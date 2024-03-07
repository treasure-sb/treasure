"use client";
import { usePalette } from "color-thief-react";

export default function ColorThief({ publicUrl }: { publicUrl: string }) {
  const { data } = usePalette(publicUrl, 2, "hex", {
    crossOrigin: "anonymous",
  });

  const initialClass = "bg-transparent opacity-0";
  const transitionClass = "transition-all duration-700 ease-in-out opacity-100";

  return (
    <>
      <div
        style={{
          backgroundColor: data && data.length > 1 ? data[0] : "transparent",
        }}
        className={`absolute w-80 h-full rounded-full z-[-50] blur-2xl md:blur-3xl top-0 left-0 ${
          data ? transitionClass : initialClass
        }`}
      />
      <div
        style={{
          backgroundColor: data && data.length > 1 ? data[1] : "transparent",
        }}
        className={`absolute bottom-0 right-0 w-80 h-full rounded-full z-[-50] blur-2xl md:blur-3xl  ${
          data ? transitionClass : initialClass
        }`}
      />
    </>
  );
}
