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
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
    >
      <Image
        className="w-full px-6 md:px-0 md:max-w-3xl md:mx-auto"
        src={photoSrc}
        layout="fill"
        objectFit="contain"
        alt="individual image"
      />
    </motion.div>
  );
}
