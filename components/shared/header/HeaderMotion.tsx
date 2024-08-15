"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useScroll,
  useTransform,
  useAnimate,
} from "framer-motion";
import { useTheme } from "next-themes";

export default function HeaderMotion({
  children,
}: {
  children: React.ReactNode;
}) {
  const { scrollY } = useScroll();
  const { theme } = useTheme();
  const [scope, animate] = useAnimate();
  const backgroundOpacity = useTransform(scrollY, [0, 80], [0, 0.98]);
  const borderOpacity = useTransform(scrollY, [0, 300], [0, 0.6]);

  const darkBackgroundColor = useMotionTemplate`rgba(18, 18, 18, ${backgroundOpacity})`;
  const lightBackgroundColor = useMotionTemplate`rgba(253, 249, 242, ${backgroundOpacity})`;

  const darkBorderColor = useMotionTemplate`rgba(253, 249, 242, ${borderOpacity})`;
  const lightBorderColor = useMotionTemplate`rgba(18, 18, 18, ${borderOpacity})`;

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious();
    const diff = current - previous;
    if (diff > 15 && current > 300) {
      animate(scope.current, { y: -120 }, { ease: "easeOut", duration: 0.25 });
    } else if (diff < -15 || current < 100) {
      animate(scope.current, { y: 0 }, { ease: "easeOut", duration: 0.25 });
    }
  });

  return (
    <motion.header
      ref={scope}
      style={{
        backgroundColor:
          theme === "dark" ? darkBackgroundColor : lightBackgroundColor,
        borderColor: theme === "dark" ? darkBorderColor : lightBorderColor,
      }}
      className="w-screen overflow-x-hidden fixed inset-x-0 border-b-[1px] py-4 px-4 sm:px-8"
    >
      <div className="max-w-[var(--container-width)] flex justify-between items-center m-auto w-full">
        {children}
      </div>
    </motion.header>
  );
}
