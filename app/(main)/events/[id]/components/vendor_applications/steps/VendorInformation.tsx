import { Button } from "@/components/ui/button";
import { useVendorApplicationStore } from "../store";
import { useProfile } from "@/app/(dashboards)/query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { motion } from "framer-motion";
import { InstagramIcon } from "lucide-react";
import { useInstagram } from "../query";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function VendorInformation() {
  const [viewProfileInfo, setViewProfileInfo] = useState(false);
  const {
    currentStep,
    inventory,
    comments,
    setCurrentStep,
    setInventory,
    setComments,
  } = useVendorApplicationStore();
  const { profile, publicUrl } = useProfile();
  const instagramUsername = useInstagram(profile);

  return (
    <>
      <motion.div layout className="space-y-4">
        <motion.h1 layout="position" className="text-xl font-semibold">
          Vendor Information
        </motion.h1>
        <Card className="bg-background flex flex-col items-center w-60 md:w-80 m-auto">
          {viewProfileInfo ? (
            <>
              <CardHeader>
                <CardTitle className="text-lg">Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>
                  <span className="text-primary font-semibold">
                    Business Name:
                  </span>{" "}
                  {profile?.business_name || "N/A"}
                </p>
                <p>
                  <span className="text-primary font-semibold">
                    First Name:
                  </span>{" "}
                  {profile?.first_name}
                </p>
                <p>
                  <span className="text-primary font-semibold">Last Name:</span>{" "}
                  {profile?.last_name}
                </p>
                <p>
                  <span className="text-primary font-semibold">Email:</span>{" "}
                  {profile?.email}
                </p>
                <p>
                  <InstagramIcon className="inline-block mr-2" />
                  {`@${instagramUsername}` || "N/A"}
                </p>
              </CardContent>
              <CardFooter className="space-x-2">
                <Link target="_blank" href="/profile/edit-profile">
                  <Button variant={"ghost"}>Edit Profile</Button>
                </Link>
                <Button
                  onClick={() => setViewProfileInfo(false)}
                  variant={"ghost"}
                >
                  Back
                </Button>
              </CardFooter>
            </>
          ) : (
            <>
              <CardHeader>
                <CardTitle className="w-40 flex flex-col items-center space-y-2">
                  <div className="text-center">
                    {profile ? (
                      <>
                        <p className="text-lg font-semibold">
                          {profile?.first_name} {profile?.last_name}
                        </p>
                        <p className="text-sm text-gray-400">
                          @{profile?.username}
                        </p>
                      </>
                    ) : (
                      <>
                        <Skeleton className="w-32 h-6 mb-1 mx-auto" />
                        <Skeleton className="w-28 h-5 mx-auto" />
                      </>
                    )}
                  </div>
                  <Avatar className="w-20 h-20 md:w-40 md:h-40">
                    <AvatarImage src={publicUrl} />
                    <AvatarFallback />
                  </Avatar>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-400 text-sm md:text-base">
                  Your profile information will be shared with the event host.
                  Make sure to update and review your profile.
                </p>
              </CardContent>
              <CardFooter className="space-x-2">
                <Link target="_blank" href="/profile/edit-profile">
                  <Button variant={"ghost"}>Edit Profile</Button>
                </Link>
                <Button
                  onClick={() => setViewProfileInfo(true)}
                  variant={"ghost"}
                >
                  Profile Info
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
        <Textarea
          value={inventory}
          onChange={(e) => setInventory(e.target.value)}
          className="w-[80%] m-auto"
          placeholder="Tell us a little bit more about your inventory. (Required)"
        />
        <Textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          className="w-[80%] m-auto"
          placeholder="Do you have any additional comments?"
        />
      </motion.div>
      <div className="flex space-x-2">
        <Button
          onClick={() => setCurrentStep(currentStep - 1)}
          className="w-full"
          variant={"secondary"}
        >
          Back
        </Button>
        <Button
          onClick={() => setCurrentStep(currentStep + 1)}
          className={`${
            inventory.length > 0
              ? "bg-primary cursor-pointer"
              : "bg-primary/40 pointer-events-none"
          } w-full`}
        >
          Continue
        </Button>
      </div>
    </>
  );
}
