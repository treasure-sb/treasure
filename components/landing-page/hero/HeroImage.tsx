import Image from "next/image";
import { motion } from "framer-motion";
import HeroCollectible from "./HeroCollectible";

export default function HeroImage() {
  const MotionImage = motion(Image);
  const chargeUpKeyframes = Array(30).fill([-2, 0, 2]).flat();
  const animationVariants = {
    initial: { scale: 0.65, x: 0 },
    animate: {
      scale: 1,
      x: chargeUpKeyframes,
      transition: {
        scale: { duration: 0.5, ease: "easeOut" },
        x: { duration: 1.5, ease: "linear" },
      },
    },
  };

  return (
    <div className="relative w-full h-96 lg:w-1/2 flex justify-center lg:justify-end">
      <MotionImage
        variants={animationVariants}
        animate="animate"
        initial="initial"
        className="object-contain w-32 h-auto"
        quality={100}
        priority
        src="/static/landing-page/hero/luffy.png"
        alt="luffy"
        width={1000}
        height={1000}
      />
      <HeroCollectible
        animateY="-10%"
        className="w-40"
        alt="charizard"
        src="/static/landing-page/hero/charizard.png"
      />
      <HeroCollectible
        className="w-32"
        animateX="120px"
        animateY={40}
        alt="spiderman"
        src="/static/landing-page/hero/spiderman.png"
      />
      <HeroCollectible
        animateX="120px"
        animateY={180}
        className="w-32"
        alt="mickey mantle"
        src="/static/landing-page/hero/mantle.png"
      />
      <HeroCollectible
        animateY="180%"
        animateX="-120px"
        className="w-32"
        alt="mickey mantle"
        src="/static/landing-page/hero/superman.png"
      />
    </div>
  );
}
