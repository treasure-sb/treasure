import { motion } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Vendor, VendorTypes } from "./Vendors";
import { getTagIcon } from "@/lib/helpers/TagIcons";
import { ArrowUpRight } from "lucide-react";

export default function VendorCardTrigger({ vendor }: { vendor: Vendor }) {
  const variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };
  const transition = { duration: 0.35, ease: "easeInOut" };
  const MotionAvatar = motion(Avatar);

  return (
    <div className="h-28 md:h-32 col-span-2 md:col-span-1 flex space-x-4 items-center border-[1px] rounded-2xl w-full p-4 py-2 relative group bg-background text-left">
      <MotionAvatar
        variants={variants}
        transition={transition}
        className="h-20 w-20 md:h-24 md:w-24"
      >
        <AvatarImage src={vendor.publicUrl} />
        <AvatarFallback />
      </MotionAvatar>
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        transition={transition}
        className="flex flex-col space-y-2 overflow-hidden"
      >
        <motion.div variants={variants}>
          <p className="font-semibold text-lg md:text-xl line-clamp-1">
            {vendor.businessName
              ? vendor.businessName
              : vendor.firstName + " " + vendor.lastName}
          </p>
          {vendor.type === VendorTypes.PROFILE && (
            <span className="text-gray-500 text-xs font-normal">
              @{vendor.username}
            </span>
          )}
          <p className="text-muted-foreground text-sm line-clamp-1">
            {vendor.bio}
          </p>
        </motion.div>
        <motion.div variants={variants} className="flex space-x-2">
          {vendor.tags.map((tag) => (
            <div key={tag}>{getTagIcon(tag)}</div>
          ))}
        </motion.div>
      </motion.div>
      {vendor.type === VendorTypes.PROFILE && (
        <ArrowUpRight
          size={18}
          className="stroke-2 absolute right-3 top-3 text-foreground/60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition duration-300 group-hover:text-foreground"
        />
      )}
    </div>
  );
}
