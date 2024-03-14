"use client";

import { Tables } from "@/types/supabase";

export default function PromoCodes({
  codes,
}: {
  codes: Tables<"event_codes">[];
}) {
  return (
    <>
      {codes?.map((code) => (
        <div className="flex w-full justify-between items-center">
          <p>{code.code}</p>
          <p>
            {code.type == "PERCENT"
              ? code.discount + "% Off"
              : "$" + code.discount + " Off"}
          </p>
          <p className="text-sm">
            Claimed {code.num_used} /{" "}
            {code.usage_limit ? code.usage_limit : "∞"}
          </p>
        </div>
      ))}
    </>
  );
}
