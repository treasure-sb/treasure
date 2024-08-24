"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  useAnimate,
} from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function HeaderMotion({
  children,
}: {
  children: React.ReactNode;
}) {
  const { scrollY } = useScroll();
  const { resolvedTheme } = useTheme();
  const [scope, animate] = useAnimate();
  const [mounted, setMounted] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("");
  const [borderColor, setBorderColor] = useState("");

  const backgroundOpacity = useTransform(scrollY, [0, 80], [0, 0.98]);
  const borderOpacity = useTransform(scrollY, [0, 300], [0, 0.6]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const updateColors = () => {
        const bgOpacity = backgroundOpacity.get();
        const brdOpacity = borderOpacity.get();

        if (resolvedTheme === "dark") {
          setBackgroundColor(`rgba(18, 18, 18, ${bgOpacity})`);
          setBorderColor(`rgba(253, 249, 242, ${brdOpacity})`);
        } else {
          setBackgroundColor(`rgba(253, 249, 242, ${bgOpacity})`);
          setBorderColor(`rgba(18, 18, 18, ${brdOpacity})`);
        }
      };

      updateColors();
      const unsubscribeBackground = backgroundOpacity.on(
        "change",
        updateColors
      );
      const unsubscribeBorder = borderOpacity.on("change", updateColors);

      return () => {
        unsubscribeBackground();
        unsubscribeBorder();
      };
    }
  }, [mounted, resolvedTheme, backgroundOpacity, borderOpacity]);

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious();
    const diff = current - previous;
    if (diff > 15 && current > 300) {
      animate(scope.current, { y: -120 }, { ease: "easeOut", duration: 0.25 });
    } else if (diff < -15 || current < 100) {
      animate(scope.current, { y: 0 }, { ease: "easeOut", duration: 0.25 });
    }
  });

  if (!mounted) {
    return null;
  }

  return (
    <motion.header
      ref={scope}
      style={{
        backgroundColor,
        borderColor,
      }}
      className="w-screen overflow-x-hidden fixed inset-x-0 border-b-[1px] py-3 md:py-2 px-4 sm:px-6"
    >
      <div className="max-w-[var(--container-width)] flex justify-between items-center m-auto w-full">
        {children}
      </div>
    </motion.header>
  );
}
