import { motion } from "framer-motion";
import { useState } from "react";
import { AnimateFrom } from "./PreviewMore";

export default function PreviewMoreCard({
  title,
  description,
  animateFrom,
  image,
}: {
  title: string;
  description: string;
  animateFrom: AnimateFrom;
  image?: string;
}) {
  const [isChildInView, setIsChildInView] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: isChildInView ? 1 : 0,
        x: isChildInView ? 0 : animateFrom === "left" ? -20 : 20,
      }}
      transition={{ duration: 0.85, ease: "easeInOut" }}
      className="space-y-7"
    >
      <h1 className="text-xl mb-2">{title}</h1>
      <p className="text-sm">{description}</p>
      <motion.div
        onViewportEnter={() => setIsChildInView(true)}
        className="w-full aspect-w-1 aspect-h-1 bg-tertiary rounded-sm"
      />
    </motion.div>
  );
}
