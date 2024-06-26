"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { FormEvent, useState } from "react";
import { EventDisplayData } from "@/types/event";
import { toast } from "sonner";
import { Tables } from "@/types/supabase";
import { updatePaymentIntent } from "@/lib/actions/stripe";
import StripeInput from "./StripeInput";

export default function PromoCode({
  event,
  promoApplied,
  checkoutSession,
  price,
}: {
  event: EventDisplayData;
  promoApplied: Tables<"event_codes"> | null;
  checkoutSession: Tables<"checkout_sessions">;
  price: number;
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

    if (
      promoData.status === "INACTIVE" ||
      (promoData.usage_limit && promoData.num_used >= promoData.usage_limit)
    ) {
      toast.dismiss();
      toast.error("Invalid promo code");
      return;
    }

    let newAmount = 0;
    if (promoData.type === "DOLLAR") {
      newAmount = Math.max(price - promoData.discount, 0);
    } else {
      newAmount = price - (price * promoData.discount) / 100;
    }

    console.log(checkoutSession);

    if (checkoutSession.payment_intent_id) {
      console.log(newAmount);
      await updatePaymentIntent(checkoutSession.payment_intent_id, newAmount);
    }

    await supabase
      .from("checkout_sessions")
      .update({ promo_id: promoData.id })
      .eq("id", checkoutSession.id);

    toast.dismiss();
    toast.success("Promo code applied!");
    refresh();
  };

  return (
    <form onSubmit={(e) => handleApplyPromo(e)} className="space-y-1">
      <p className="text-sm">Promo Code</p>
      {promoApplied && (
        <div>
          <p className="font-bold">{promoApplied.code}</p>
          <p className="text-xs text-muted-foreground">
            You have applied a{" "}
            {promoApplied.type === "DOLLAR"
              ? `$${promoApplied.discount}`
              : `${promoApplied.discount}%`}{" "}
            off promo code
          </p>
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
