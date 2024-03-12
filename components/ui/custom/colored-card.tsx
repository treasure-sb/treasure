"use client";
import { motion, useInView } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

export default function ColoredCard({
  children,
  color,
  className,
}: {
  children: React.ReactNode;
  color?: string;
  className?: string;
}) {
  const mobileActiveRef = useRef<HTMLDivElement | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const inView = useInView(mobileActiveRef);
  const colorCardMargin = "8px";
  const checkIsMobile = () => window.innerWidth < 640;

  useEffect(() => {
    setIsMobile(checkIsMobile());
    const handleResize = () => {
      setIsMobile(checkIsMobile());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsActive(inView);
    }
  }, [inView]);

  return (
    <div
      onMouseEnter={() => !isMobile && setIsActive(true)}
      onMouseLeave={() => !isMobile && setIsActive(false)}
      className="relative w-full h-full"
    >
      <div
        className={cn(
          "bg-tertiary rounded-sm -z-20 w-full h-full",
          className,
          color
        )}
      />
      <motion.div
        animate={{
          marginTop: isActive ? colorCardMargin : "0px",
          marginBottom: isActive ? colorCardMargin : "0px",
          marginLeft: isActive ? colorCardMargin : "0px",
          marginRight: isActive ? colorCardMargin : "0px",
        }}
        transition={{ duration: 0.3 }}
        className="inset-0 absolute p-10 rounded-sm z-20 bg-background"
      >
        <div className="w-[calc(100%-20px)] flex flex-col justify-between h-full">
          {children}
        </div>
      </motion.div>
      <div ref={mobileActiveRef} className="absolute bottom-[50%]" />
    </div>
  );
}
