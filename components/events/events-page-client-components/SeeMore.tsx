"use client";

import { Button } from "@/components/ui/button";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function SeeMore() {
  const [range, setRange] = useState(5);
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleClick = () => {
    const params = new URLSearchParams(searchParams);
    params.set("numEvents", `${range + 5}`);
    setRange(range + 4);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex justify-center">
      <Button
        variant={"secondary"}
        onClick={handleClick}
        className="w-10 h-10 rounded-full"
      ></Button>
    </div>
  );
}
