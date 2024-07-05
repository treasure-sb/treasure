import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type Vendor, VendorTypes } from "./Vendors";
import { ArrowUpRight } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { socialLinkData } from "@/lib/helpers/links";
import { Dialog } from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import VendorCardTrigger from "./VendorCardTrigger";

export default function MainVendorCard({ vendor }: { vendor: Vendor }) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger>
          <VendorCardTrigger vendor={vendor} />
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[500px]"
          onOpenAutoFocus={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>
              {vendor.businessName
                ? vendor.businessName
                : vendor.firstName + " " + vendor.lastName}{" "}
              {vendor.type === VendorTypes.PROFILE && (
                <span className="text-gray-500 text-xs font-normal">
                  @{vendor.username}
                </span>
              )}
            </DialogTitle>
            <DialogDescription>{vendor.bio}</DialogDescription>
            {vendor.type === VendorTypes.PROFILE && (
              <Link
                href={`/${vendor.username}`}
                className="text-xs flex items-center space-x-1 ml-auto"
              >
                <p>Full Profile</p>
                <ArrowUpRight size={12} />
              </Link>
            )}
          </DialogHeader>
          <div className="flex space-x-4">
            <Avatar className="h-32 w-32">
              <AvatarImage src={vendor.publicUrl} />
              <AvatarFallback />
            </Avatar>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {vendor.tags.map((tag) => (
                    <p className="text-muted-foreground text-sm" key={tag}>
                      {tag}
                    </p>
                  ))}
                </div>
              </div>

              {vendor.inventory && (
                <div>
                  <h4 className="text-sm font-semibold">Description</h4>
                  <p className="text-muted-foreground text-sm">
                    {vendor.inventory}
                  </p>
                </div>
              )}

              {vendor.links.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold">Social Links</h4>
                  <div className="flex">
                    {vendor.links.map((link, index) => (
                      <Link
                        target="_blank"
                        key={index}
                        href={`${socialLinkData[link.application].url}${
                          link.username
                        }`}
                        className="w-8 h-8"
                      >
                        <div className="scale-50">
                          {socialLinkData[link.application].icon}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger>
        <VendorCardTrigger vendor={vendor} />
      </DrawerTrigger>
      <DrawerContent
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        <DrawerHeader className="text-left">
          {vendor.type === VendorTypes.PROFILE && (
            <Link
              href={`/${vendor.username}`}
              className="text-xs flex items-center space-x-1 ml-auto"
            >
              <p>Full Profile</p>
              <ArrowUpRight size={12} />
            </Link>
          )}
          <DrawerTitle>
            {vendor.businessName
              ? vendor.businessName
              : vendor.firstName + " " + vendor.lastName}{" "}
            {vendor.type === VendorTypes.PROFILE && (
              <span className="text-gray-500 text-xs font-normal">
                @{vendor.username}
              </span>
            )}
          </DrawerTitle>

          <DrawerDescription>{vendor.bio}</DrawerDescription>
          <div className="flex bg-secondary/30 rounded-md p-3 space-x-4">
            <Avatar className="h-32 w-32">
              <AvatarImage src={vendor.publicUrl} />
              <AvatarFallback />
            </Avatar>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {vendor.tags.map((tag) => (
                    <p className="text-muted-foreground text-sm" key={tag}>
                      {tag}
                    </p>
                  ))}
                </div>
              </div>

              {vendor.inventory && (
                <div>
                  <h4 className="text-sm font-semibold">Description</h4>
                  <p className="text-muted-foreground text-sm max-h-36 overflow-scroll scrollbar-hidden">
                    {vendor.inventory}
                  </p>
                </div>
              )}

              {vendor.links.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold">Social Links</h4>
                  <div className="flex">
                    {vendor.links.map((link, index) => (
                      <Link
                        target="_blank"
                        key={index}
                        href={`${socialLinkData[link.application].url}${
                          link.username
                        }`}
                        className="w-8 h-8"
                      >
                        <div className="scale-50">
                          {socialLinkData[link.application].icon}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </DrawerHeader>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Back</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
