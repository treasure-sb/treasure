"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function SingleImageOverlay({
  photoSrc,
  handleClose,
}: {
  photoSrc: string;
  handleClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={() => handleClose()}
      className="fixed -inset-6 bg-black bg-opacity-70 flex items-center justify-center z-50"
    >
      <Image
        className="px-12 md:px-0 md:mx-auto"
        src={photoSrc}
        width={500}
        height={300}
        objectFit="contain"
        alt="individual image"
      />
    </motion.div>
  );
}
