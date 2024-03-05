import { motion } from "framer-motion";
import { useEffect } from "react";

export default function Welcome({ closeDialog }: { closeDialog?: () => void }) {
  useEffect(() => {
    if (closeDialog) {
      setTimeout(() => {
        closeDialog();
      }, 5000);
    }
  }, []);

  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 0, y: 5 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay: 0.7 },
      }}
    >
      <h1>Welcome</h1>
      <p>Welcome to the app</p>
    </motion.div>
  );
}
