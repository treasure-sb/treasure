"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createTemporaryVendor } from "@/lib/actions/vendors/temporary";
import { validateUser } from "@/lib/actions/auth";
import { createClient } from "@/utils/supabase/client";
import AvatarEdit from "@/app/(main)/profile/edit-profile/components/AvatarEdit";

const TempVendorSchema = z.object({
  business_name: z.string().min(1, {
    message: "Business name is required",
  }),
  email: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string()
      .email({
        message: "Invalid email address",
      })
      .optional()
  ),
  instagram: z.string().optional(),
});

export type TempVendorCreateProps = {
  business_name: string;
  avatar_url: string;
  email?: string;
  instagram?: string;
};

export default function CreateTempVendor({
  openCreate,
  setOpenCreate,
  goBackToSearch,
}: {
  openCreate: boolean;
  setOpenCreate: (open: boolean) => void;
  goBackToSearch: () => void;
}) {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const supabase = createClient();
  const form = useForm<z.infer<typeof TempVendorSchema>>({
    resolver: zodResolver(TempVendorSchema),
    defaultValues: {
      business_name: "",
      email: "",
      instagram: "",
    },
  });

  const { refresh } = useRouter();
  const { reset } = form;

  const onSubmit = async (values: z.infer<typeof TempVendorSchema>) => {
    toast.loading("Creating temporary vendor...");

    const {
      data: { user },
    } = await validateUser();

    if (!user) {
      toast.dismiss();
      toast.error("User not found");
      return;
    }

    let avatarSupabaseUrl = "default_avatar";
    if (avatarFile) {
      const extension = avatarFile.name.split(".").pop();
      avatarSupabaseUrl = `temporary/avatar${Date.now()}.${extension}`;
      await supabase.storage
        .from("avatars")
        .upload(avatarSupabaseUrl, avatarFile);
    }

    const createValues: TempVendorCreateProps = {
      ...values,
      avatar_url: avatarSupabaseUrl,
    };

    const { error } = await createTemporaryVendor(createValues, user.id);

    if (error) {
      toast.dismiss();
      toast.error("Failed to create temporary vendor");
      return;
    }

    toast.dismiss();
    toast.success("Temporary vendor created!");
    refresh();
    reset({
      business_name: "",
      email: "",
      instagram: "",
    });
    setOpenCreate(false);
  };

  return (
    <Dialog open={openCreate} onOpenChange={setOpenCreate}>
      <DialogContent className="w-[80%] md:w-[26rem]">
        <DialogHeader>
          <DialogTitle className="mb-4">Create Temporary Vendor</DialogTitle>
        </DialogHeader>
        <div className="w-fit mb-2 mx-auto">
          <AvatarEdit setAvatarFile={setAvatarFile} />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="business_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingLabelInput label="Business Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingLabelInput
                      label="Email (optional)"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage className="h-2" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="instagram"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingLabelInput
                      label="Instagram (optional)"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage className="h-2" />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button
                className="rounded-sm"
                onClick={goBackToSearch}
                variant={"secondary"}
                type="button"
              >
                Search Temporary Vendors
              </Button>
              <Button className="rounded-sm w-24">Create</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
