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

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["COHOST", "HOST", "STAFF", "SCANNER"], {
    required_error: "Please select a role",
  }),
});

export default function AddMember({ event }: { event: EventDisplayData }) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const { refresh } = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    toast.loading("Sending invite...");

    try {
      const inviteEmail = values.email;
      const role = values.role;

      const profileId = await getProfileFromEmail(inviteEmail);
      if (!profileId) return;

      await createEventRole(profileId, role);
      const tokenId = await createInviteToken(role, profileId);

      const emailPayload: TeamInviteProps = {
        eventName: event.name,
        posterUrl: event.publicPosterUrl,
        inviteToken: tokenId,
        role: roleMap[role],
      };

      await sendTeamInviteEmail(inviteEmail, emailPayload);

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

  const getProfileFromEmail = async (email: string) => {
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
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
                      onValueChange={field.onChange}
                      defaultValue={field.value}
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
            <div className="flex flex-col space-y-8 md:flex-row md:space-y-0 md:space-x-2 md:items-center">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-1 relative">
                    <FormControl>
                      <Input
                        placeholder="Enter email address"
                        {...field}
                        className="border p-2 px-4 rounded-md h-14 focus-within:border-primary"
                      />
                    </FormControl>
                    <FormMessage className="absolute top-[90%] left-0" />
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
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
