"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Guest } from "./EventGuests";
import { MoreVerticalIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formSchema } from "./AddEventGuests";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AvatarEdit from "@/app/(main)/profile/edit-profile/components/AvatarEdit";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { editGuest } from "@/lib/actions/edit-events";

export type EditGuestForm = {
  id: string;
  name: string;
  bio: string;
  avatar_url: string;
};

export default function EditEventGuest({ guest }: { guest: Guest }) {
  const [openSheet, setOpenSheet] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: guest.name,
      bio: guest.bio,
    },
  });
  const supabase = createClient();
  const { refresh } = useRouter();

  const handleEdit = async () => {
    try {
      toast.loading("Editing guest...");
      let avatarSupabaseUrl = guest.avatar_url;

      if (avatarFile) {
        const newAvatarUrl = `avatar${Date.now()}`;
        if (guest.avatar_url) {
          const { error: removeError } = await supabase.storage
            .from("guest_images")
            .remove([guest.avatar_url]);

          if (removeError) {
            console.error("Failed to remove old avatar:", removeError);
          }
        }

        const { error: uploadError } = await supabase.storage
          .from("guest_images")
          .upload(newAvatarUrl, avatarFile);

        if (uploadError) {
          throw new Error(
            `Failed to upload new avatar: ${uploadError.message}`
          );
        }
        avatarSupabaseUrl = newAvatarUrl;
      }

      const uploadForm: EditGuestForm = {
        ...form.getValues(),
        id: guest.id,
        avatar_url: avatarSupabaseUrl,
      };

      const { error } = await editGuest(uploadForm);

      if (error) {
        throw new Error("Failed to edit guest");
      }

      toast.dismiss();
      toast.success("Guest edited successfully");
      refresh();
    } catch (err: any) {
      toast.dismiss();
      toast.error(err.message);
    }
  };

  const handleDelete = async (guestId: string) => {
    try {
      toast.loading("Deleting guest...");

      const { error: removeGuestError } = await supabase
        .from("event_guests")
        .delete()
        .eq("id", guestId);

      if (removeGuestError) {
        throw new Error("Failed to delete guest");
      }

      const { error: removeImageError } = await supabase.storage
        .from("guest_images")
        .remove([guest.avatar_url]);

      if (removeImageError) {
        throw new Error("Failed to delete guest image");
      }

      toast.dismiss();
      toast.success("Guest deleted successfully");
      refresh();
    } catch (err: any) {
      toast.dismiss();
      toast.error(err.message);
    }
  };

  return (
    <div className="flex justify-between w-full">
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this guest?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              guest.
            </DialogDescription>
          </DialogHeader>
          <div className="flex w-full space-x-2">
            <DialogTrigger asChild>
              <Button
                variant={"secondary"}
                className="rounded-sm"
                onClick={() => setOpenDeleteDialog(false)}
              >
                Cancel
              </Button>
            </DialogTrigger>
            <Button
              variant={"destructive"}
              className="rounded-sm"
              onClick={async () => await handleDelete(guest.id)}
            >
              Delete Guest
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Form {...form}>
        <Sheet open={openSheet} onOpenChange={setOpenSheet}>
          <SheetContent>
            <SheetHeader className="mb-6">
              <SheetTitle>Edit Guest</SheetTitle>
            </SheetHeader>
            <form
              onSubmit={form.handleSubmit(handleEdit)}
              className="space-y-6"
            >
              <div className="w-fit">
                <AvatarEdit
                  avatarUrl={guest.publicUrl}
                  setAvatarFile={setAvatarFile}
                />
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea placeholder="Bio" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="rounded-sm w-full" type="submit">
                Edit Guest
              </Button>
            </form>
          </SheetContent>
        </Sheet>
      </Form>
      <div className="flex space-x-4">
        <Avatar className="h-32 w-32 m-auto">
          <AvatarImage src={guest.publicUrl} />
          <AvatarFallback>{`${guest.name[0]}`}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col justify-center text-left">
          <h2 className="font-semibold text-xl">{guest.name}</h2>
          <p className="text-sm whitespace-pre-line text-gray-500">
            {guest.bio}
          </p>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <MoreVerticalIcon className="text-foreground/60 group-hover:text-foreground transition duration-500 hover:cursor-pointer z-10" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="absolute right-[-12px]">
          <DropdownMenuItem onClick={() => setOpenSheet(true)}>
            Edit Guest
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={async () => setOpenDeleteDialog(true)}
            className="bg-destructive focus:bg-destructive/30 disabled:bg-destructive/30"
          >
            Delete Guest
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
