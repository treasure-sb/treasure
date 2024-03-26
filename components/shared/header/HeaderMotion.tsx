"use client";
import {
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useScroll,
  useTransform,
  useAnimate,
} from "framer-motion";

export default function HeaderMotion({
  children,
}: {
  children: React.ReactNode;
}) {
  const { scrollY } = useScroll();
  const [scope, animate] = useAnimate();
  const backgroundOpacity = useTransform(scrollY, [0, 20], [0, 0.98]);
  const borderOpacity = useTransform(scrollY, [0, 20], [0, 0.2]);

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious();
    const diff = current - previous;
    if (diff > 0 && current > 300) {
      animate(scope.current, { y: -120 }, { ease: "easeOut", duration: 0.25 });
    } else if (diff < 0) {
      animate(scope.current, { y: 0 }, { ease: "easeOut", duration: 0.25 });
    }
  });

  return (
    <motion.header
      ref={scope}
      style={{
        backgroundColor: useMotionTemplate`rgba(18, 18, 18, ${backgroundOpacity})`,
        borderColor: useMotionTemplate`rgba(255, 255, 255, ${borderOpacity})`,
      }}
      className="h-20 md:h-24 w-screen fixed inset-x-0 border-b-[1px]"
    >
      <div className="max-w-[var(--container-width)] py-4 px-4 md:px-0 flex justify-between items-center m-auto">
        {children}
      </div>
    </motion.header>
  );
}
