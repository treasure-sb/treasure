"use client";
import { usePalette } from "color-thief-react";

export default function ColorThief({ publicUrl }: { publicUrl: string }) {
  const { data } = usePalette(publicUrl, 2, "hex", {
    crossOrigin: "anonymous",
  });

  const initialClass = "bg-transparent opacity-0";
  const transitionClass = "transition-all duration-700 ease-in-out opacity-30";

  return (
    <div>
      <div
        style={{
          backgroundColor: data && data.length > 1 ? data[0] : "transparent",
        }}
        className={`absolute w-full h-full md:h-60 rounded-full z-[-5] blur-[42px] top-[-20px] left-0 md:blur-3xl ${
          data ? transitionClass : initialClass
        }`}
      />
      <div
        style={{
          backgroundColor: data && data.length > 1 ? data[1] : "transparent",
        }}
        className={`absolute bottom-[-30px] right-0 w-full h-full md:h-60 md:top-40 rounded-full z-[-10] blur-[42px] md:blur-3xl  ${
          data ? transitionClass : initialClass
        }`}
      />
    </div>
  );
}
