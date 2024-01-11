"use client";

import { getSocialIcon, socialLinkData } from "@/lib/helpers/links";
import { Tables } from "@/types/supabase";
import { EditProfileFormReturn } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SocialLinks({
  form,
  userSocialLinks,
}: {
  form: EditProfileFormReturn;
  userSocialLinks: Partial<Tables<"links">>[] | undefined;
}) {
  const [availableSocialLinks, setAvailableSocialLinks] = useState(
    Object.keys(socialLinkData)
  );

  useEffect(() => {
    const userApplications = userSocialLinks?.map((link) => link.application);
    const updatedLinks = Object.keys(socialLinkData).filter(
      (link) => !userApplications?.includes(link)
    );
    setAvailableSocialLinks(updatedLinks);
  }, userSocialLinks);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "social_links",
  });

  const addSocialLink = (application: string) => {
    setTimeout(() => {
      append({
        username: "",
        application: application,
        type: "social",
      });

      const updatedLinks = availableSocialLinks.filter(
        (link) => link !== application
      );
      setAvailableSocialLinks(updatedLinks);
    }, 0);
  };

  const removeSocialLink = (index: number) => {
    const removedLink = fields[index];
    remove(index);
    const updatedLinks = [...availableSocialLinks, removedLink.application];
    setAvailableSocialLinks(updatedLinks);
  };

  return (
    <>
      {fields.map((field, index) => {
        return (
          <div key={field.id} className="flex space-x-2 items-center">
            <div className="mr-2">{getSocialIcon(field.application)}</div>
            <FormField
              control={form.control}
              name={`social_links.${index}.username`}
              render={({ field }) => {
                return (
                  <FormItem className="w-full">
                    <FormControl>
                      <div className="relative">
                        <Input
                          className="pl-6"
                          placeholder="Username"
                          {...field}
                        />
                        <p className="absolute top-2 text-lg">@</p>
                      </div>
                    </FormControl>
                    <div className="h-1">
                      <FormMessage />
                    </div>
                  </FormItem>
                );
              }}
            />
            <Button
              type="button"
              variant={"ghost"}
              onClick={() => removeSocialLink(index)}
              className="text-destructive hover:text-destructive"
            >
              Remove
            </Button>
          </div>
        );
      })}
      {availableSocialLinks.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger className="w-44 border-[1px] rounded-full py-2">
            Add Social Link
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-44">
            {availableSocialLinks.map((link) => (
              <DropdownMenuItem onClick={() => addSocialLink(link)} key={link}>
                {link}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
