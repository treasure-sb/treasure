import React, { useEffect } from "react";
import {
  cubicBezier,
  motion,
  Variants,
  useAnimationControls,
} from "framer-motion";
import { customLandingEase } from "../Free";
import { cn } from "@/lib/utils";
import Image from "next/image";

type AnimateProps = {
  animateX?: string | number;
  animateY?: string | number;
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  bounceHeight?: number;
  bounceDuration?: number;
  delayStart?: number;
};

export default function HeroCollectible({
  animateX,
  animateY,
  src,
  alt,
  className,
  width = 1000,
  height = 1000,
  bounceHeight = 10,
  bounceDuration = 1,
  delayStart = 1.5,
}: AnimateProps) {
  const floatyEase = cubicBezier(0.2, 0, 0.65, 1);
  const MotionImage = motion(Image);
  const controls = useAnimationControls();

  const collectVariants: Variants = {
    initial: {
      opacity: 0,
      x: 0,
      y: 0,
    },
    animate: {
      opacity: 1,
      x: animateX,
      y: animateY,
      transition: {
        opacity: { delay: delayStart, duration: 0.5, ease: customLandingEase },
        x: { delay: delayStart, duration: 0.5, ease: customLandingEase },
        y: { delay: delayStart, duration: 0.5, ease: customLandingEase },
      },
    },
  };

  useEffect(() => {
    const sequence = async () => {
      await controls.start("animate");
      let bounceKeyframes;
      if (typeof animateY === "number") {
        bounceKeyframes = [animateY, animateY - bounceHeight, animateY];
      } else if (typeof animateY === "string" && animateY.endsWith("%")) {
        const baseValue = parseFloat(animateY);
        bounceKeyframes = [
          `${baseValue}%`,
          `${baseValue - (bounceHeight / height) * 100}%`,
          `${baseValue}%`,
        ];
      } else {
        bounceKeyframes = [
          animateY,
          `calc(${animateY} - ${bounceHeight}px)`,
          animateY,
        ];
      }

      controls.start({
        y: bounceKeyframes,
        transition: {
          duration: bounceDuration,
          repeat: Infinity,
          repeatType: "reverse",
          ease: floatyEase,
        },
      });
    };

    sequence();
  }, [controls, animateY, bounceHeight, bounceDuration, height]);

  return (
    <MotionImage
      variants={collectVariants}
      initial="initial"
      animate={controls}
      className={cn("w-52 h-auto absolute", className)}
      src={src}
      alt={alt}
      width={width}
      height={height}
    />
  );
}
