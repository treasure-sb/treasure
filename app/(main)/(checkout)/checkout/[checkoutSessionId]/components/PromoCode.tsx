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
  updatePrice,
}: {
  event: EventDisplayData;
  promoApplied: Tables<"event_codes"> | null;
  checkoutSession: Tables<"checkout_sessions">;
  startingPrice: number;
  updatePrice: (newPrice: number) => void;
}) {
  const { refresh } = useRouter();
  const [promoCode, setPromoCode] = useState("");

  const supabase = createClient();

  const handleApplyPromo = async (e: FormEvent) => {
    e.preventDefault();

    toast.loading("Applying promo code...");

    const { data, error } = await supabase
      .from("event_codes")
      .select("*")
      .eq("code", promoCode)
      .eq("event_id", event.id)
      .single();

    if (!data || error) {
      toast.dismiss();
      toast.error("Invalid promo code");
      return;
    }

    const promoData: Tables<"event_codes"> = data;

    if (promoData.status === "INACTIVE") {
      toast.dismiss();
      toast.error("Invalid promo code");
      return;
    }
    if (promoData.usage_limit && promoData.num_used >= promoData.usage_limit) {
      toast.dismiss();
      toast.error("Promo code has reached its usage limit");
      return;
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
    updatePrice(newAmount);
    refresh();
  };

  const handleRemovePromo = async () => {
    await supabase
      .from("checkout_sessions")
      .update({ promo_id: null })
      .eq("id", checkoutSession.id);

    updatePrice(startingPrice);
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
