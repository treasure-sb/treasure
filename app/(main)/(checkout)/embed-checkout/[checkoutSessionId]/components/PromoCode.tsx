"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { FormEvent, useState } from "react";
import { EventDisplayData } from "@/types/event";
import { toast } from "sonner";
import { Tables } from "@/types/supabase";
import { XIcon } from "lucide-react";
import StripeInput from "./StripeInput";

export default function PromoCode({
  event,
  promoApplied,
  checkoutSession,
  startingPrice,
}: {
  event: EventDisplayData;
  promoApplied: Tables<"event_codes"> | null;
  checkoutSession: Tables<"checkout_sessions">;
  startingPrice: number;
}) {
  const { refresh } = useRouter();
  const [promoCode, setPromoCode] = useState("");

  const supabase = createClient();

  const handleApplyPromo = async (e: FormEvent) => {
    e.preventDefault();
    try {
      toast.loading("Applying promo code...");

      const { data, error } = await supabase
        .from("event_codes")
        .select("*")
        .eq("code", promoCode.toUpperCase())
        .or(`event_id.eq.${event.id},event_id.is.null`)
        .single();

      if (!data || error) {
        throw new Error("Invalid promo code");
      }

      const promoData: Tables<"event_codes"> = data;

      if (promoData.status === "INACTIVE") {
        throw new Error("Promo code is inactive");
      }

      if (
        promoData.usage_limit &&
        promoData.num_used >= promoData.usage_limit
      ) {
        throw new Error("Promo code has reached its usage limit");
      }

      let newAmount = 0;
      if (promoData.type === "DOLLAR") {
        newAmount = Math.max(startingPrice - promoData.discount, 0);
      } else {
        newAmount = startingPrice - (startingPrice * promoData.discount) / 100;
      }

      newAmount = parseFloat(newAmount.toFixed(2));

      await supabase
        .from("checkout_sessions")
        .update({ promo_id: promoData.id })
        .eq("id", checkoutSession.id);

      toast.dismiss();
      toast.success("Promo code applied!");
      refresh();
    } catch (err: any) {
      toast.dismiss();
      toast.error(err.message);
    }
  };

  const handleRemovePromo = async () => {
    await supabase
      .from("checkout_sessions")
      .update({ promo_id: null })
      .eq("id", checkoutSession.id);
    refresh();
  };

  return (
    <form onSubmit={(e) => handleApplyPromo(e)} className="space-y-1">
      <p className="text-sm">Promo Code</p>
      {promoApplied && (
        <div className="flex justify-between">
          <div>
            <p className="font-bold">{promoApplied.code}</p>
            <p className="text-xs text-muted-foreground">
              You have applied a{" "}
              {promoApplied.type === "DOLLAR"
                ? `$${promoApplied.discount}`
                : `${promoApplied.discount}%`}{" "}
              off promo code!
            </p>
          </div>
          <XIcon
            className="cursor-pointer text-muted-foreground hover:text-foreground transition duration-500"
            size={14}
            onClick={handleRemovePromo}
          />
        </div>
      )}
      <div className="flex space-x-2">
        <StripeInput
          placeholder="Enter your promo code"
          onChange={(e) => setPromoCode(e.target.value)}
        />
        <Button className="rounded-md" id="submit">
          Apply
        </Button>
      </div>
    </form>
  );
}
