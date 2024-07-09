import { ring } from "ldrs";
import { motion } from "framer-motion";

ring.register();

export default function Loading() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed bg-primary/5 inset-0 flex flex-col items-center justify-center space-y-8"
    >
      <motion.div className="flex flex-col items-center">
        <p className="font-normal text-xl mb-4">Processing your payment...</p>
        <l-ring
          size="40"
          stroke="5"
          bg-opacity="0"
          speed="2"
          color="#71d08c"
        ></l-ring>
      </motion.div>
    </motion.div>
  );
}
