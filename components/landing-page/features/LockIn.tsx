"use client";
import { motion } from "framer-motion";
import ColoredCard from "../../ui/custom/colored-card";
import CardFilp from "../../ui/custom/card-flip";

export default function Create() {
  return (
    <div className="w-full h-[600px]">
      <CardFilp>
        <ColoredCard color="bg-orange-400">
          <h2 className="text-3xl">Lock in Attendees & Get Paid in Advance</h2>
          <p>
            Secure your event's success and streamline your revenue with our
            easy to use event tools.
          </p>
        </ColoredCard>
      </CardFilp>
    </div>
  );
}
