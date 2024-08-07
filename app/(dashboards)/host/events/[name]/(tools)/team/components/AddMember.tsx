"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { EventDisplayData } from "@/types/event";
import { sendTeamInviteEmail } from "@/lib/actions/emails";
import { TeamInviteProps } from "@/emails/TeamInvite";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { roleMap } from "./MemberCard";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PhoneInput, {
  filterPhoneNumber,
} from "@/components/ui/custom/phone-input-non-floating";
import { sendTeamInviteSMS } from "@/lib/sms";
import { RoleMapKey } from "./ListMembers";

const emailSchema = z.object({
  contact: z.string().email("Please enter a valid email address"),
  role: z.enum(["COHOST", "HOST", "STAFF", "SCANNER"], {
    required_error: "Please select a role",
  }),
});

const phoneSchema = z.object({
  contact: z
    .string()
    .transform((val) => filterPhoneNumber(val))
    .refine(
      (val) => /^\d{10}$/.test(val),
      "Please enter a valid 10-digit phone number"
    ),
  role: z.enum(["COHOST", "HOST", "STAFF", "SCANNER"], {
    required_error: "Please select a role",
  }),
});

export default function AddMember({ event }: { event: EventDisplayData }) {
  const [useEmail, setUseEmail] = useState(true);
  const [selectedRole, setSelectedRole] = useState<RoleMapKey | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const { refresh } = useRouter();

  const form = useForm<
    z.infer<typeof emailSchema> | z.infer<typeof phoneSchema>
  >({
    resolver: zodResolver(useEmail ? emailSchema : phoneSchema),
    defaultValues: {
      contact: "",
      role: selectedRole || undefined,
    },
  });

  const onSubmit = async (
    values: z.infer<typeof emailSchema> | z.infer<typeof phoneSchema>
  ) => {
    setLoading(true);
    toast.loading("Sending invite...");

    try {
      const contact = values.contact;
      const role = values.role;

      const profileId = await getProfileFromContact(contact);
      if (!profileId) return;

      await createEventRole(profileId, role);
      const tokenId = await createInviteToken(role, profileId);

      if (useEmail) {
        const emailPayload: TeamInviteProps = {
          eventName: event.name,
          posterUrl: event.publicPosterUrl,
          inviteToken: tokenId,
          role: roleMap[role],
        };
        await sendTeamInviteEmail(contact, emailPayload);
      } else {
        await sendTeamInviteSMS(contact, roleMap[role], event.name, tokenId);
      }

      toast.dismiss();
      toast.success("Invite sent");
      refresh();
    } catch (error) {
      toast.dismiss();
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (error: unknown) => {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("Failed to send invite");
    }
  };

  const getProfileFromContact = async (contact: string) => {
    const column = useEmail ? "email" : "phone";
    const searchContact = useEmail ? contact : `+1${contact}`;
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq(column, searchContact)
      .single();

    const profileId: { id: string } | null = profileData;

    if (!profileId || profileError) {
      throw new Error("User not found");
    }

    return profileId.id;
  };

  const createEventRole = async (profileId: string, role: string) => {
    const { error: insertError } = await supabase.from("event_roles").insert([
      {
        event_id: event.id,
        user_id: profileId,
        role,
        status: "PENDING",
      },
    ]);

    if (insertError) {
      if (insertError.message.includes("duplicate key value")) {
        throw new Error("User has already been invited");
      }
      throw new Error("Failed to send invite");
    }
  };

  const createInviteToken = async (role: string, profileId: string) => {
    const { data: tokenData, error: tokenError } = await supabase
      .from("event_roles_invite_tokens")
      .insert([
        {
          role,
          event_id: event.id,
          member_id: profileId,
        },
      ])
      .select("id")
      .single();

    if (tokenError) {
      throw new Error("Failed to send invite");
    }

    const tokenId: { id: string } = tokenData;
    return tokenId.id;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"dotted"} className="rounded-sm">
          <PlusIcon size={16} />
          <span>Add Team Member</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="py-7">
        <DialogHeader>
          <DialogTitle>Add a team member to your event</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-8 md:space-y-4"
          >
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Select a role</FormLabel>
                  <FormControl>
                    <RadioGroup
                      defaultValue={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedRole(value as RoleMapKey);
                      }}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="HOST" />
                        </FormControl>
                        <FormLabel className="font-normal">Host</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="COHOST" />
                        </FormControl>
                        <FormLabel className="font-normal">Co-Host</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="STAFF" />
                        </FormControl>
                        <FormLabel className="font-normal">Staff</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="SCANNER" />
                        </FormControl>
                        <FormLabel className="font-normal">Scanner</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex flex-col space-y-8 md:flex-row md:space-y-0 md:space-x-2 md:items-center relative">
              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem className="flex-1 relative">
                    <FormControl>
                      {useEmail ? (
                        <Input
                          placeholder={
                            useEmail
                              ? "Enter email address"
                              : "Enter phone number"
                          }
                          {...field}
                          className="border p-2 px-4 rounded-md h-14 focus-within:border-primary"
                        />
                      ) : (
                        <PhoneInput
                          className="border p-2 px-4 rounded-md h-14 focus-within:border-primary"
                          phoneNumber={field.value}
                          updatePhoneNumber={field.onChange}
                          placeholder="Enter phone number"
                        />
                      )}
                    </FormControl>
                    <FormMessage className="text-xs md:text-sm absolute top-[90%] left-[30%] whitespace-nowrap" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={loading}
                className="rounded-sm h-12 md:ml-2"
              >
                <span>Invite</span>
              </Button>
              <Button
                type="button"
                variant={"link"}
                className="absolute top-4 -left-2 md:top-12 md:-left-4 text-xs font-normal text-muted-foreground"
                onClick={() => {
                  setUseEmail(!useEmail);
                  form.reset({ contact: "", role: selectedRole || undefined });
                }}
              >
                {useEmail ? "Use Phone" : "Use Email"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
