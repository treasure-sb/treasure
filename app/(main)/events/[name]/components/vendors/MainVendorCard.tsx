import Link from "next/link";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type Vendor, VendorTypes } from "./Vendors";
import { getTagIcon } from "@/lib/helpers/TagIcons";
import { ArrowUpRight } from "lucide-react";

export default function MainVendorCard({ vendor }: { vendor: Vendor }) {
  const variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const transition = { duration: 0.35, ease: "easeInOut" };

  const MotionAvatar = motion(Avatar);

  return (
    <Link
      href={
        vendor.type === VendorTypes.PROFILE
          ? `/${vendor.username}`
          : `/${vendor.username}?type=t`
      }
      className="h-28 md:h-32 col-span-2 md:col-span-1 flex space-x-4 items-center border-[1px] rounded-2xl w-full p-4 py-2 relative group bg-background"
    >
      <MotionAvatar
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={transition}
        className="h-20 w-20 md:h-28 md:w-28"
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
          <p className="font-semibold text-lg md:text-xl line-clamp-2">
            {vendor.businessName
              ? vendor.businessName
              : vendor.firstName + " " + vendor.lastName}
          </p>
          <p className="text-xxs md:text-xs text-gray-500">
            @{vendor.username}
          </p>
          <p className="text-muted-foreground text-sm line-clamp-2">
            {vendor.bio}
          </p>
        </motion.div>
        <motion.div variants={variants} className="flex space-x-2">
          {vendor.tags.map((tag) => (
            <div key={tag}>{getTagIcon(tag)}</div>
          ))}
        </motion.div>
      </motion.div>
      <ArrowUpRight
        size={18}
        className="stroke-2 absolute right-3 top-3 text-foreground/60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition duration-300 group-hover:text-foreground"
      />
    </Link>
  );
}
