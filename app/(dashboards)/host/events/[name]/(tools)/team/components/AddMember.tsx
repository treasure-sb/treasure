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
  FormMessage,
} from "@/components/ui/form";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { EventDisplayData } from "@/types/event";
import { sendTeamInviteEmail } from "@/lib/actions/emails";
import { TeamInviteProps } from "@/emails/TeamInvite";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export default function AddMember({ event }: { event: EventDisplayData }) {
  const supabase = createClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    toast.loading("Sending invite...");

    const inviteEmail = values.email;
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", inviteEmail)
      .single();

    const profileID: { id: string } | null = profileData;

    if (!profileID || profileError) {
      toast.dismiss();
      toast.error("User not found");
      return;
    }

    const { data: tokenData, error: tokenError } = await supabase
      .from("event_roles_invite_tokens")
      .insert([
        {
          role: "COHOST",
          event_id: event.id,
          member_id: profileID.id,
        },
      ])
      .select("id")
      .single();

    if (tokenError) {
      toast.dismiss();
      toast.error("Error sending invite");
      return;
    }

    const tokenID: { id: string } = tokenData;

    const emailPayload: TeamInviteProps = {
      eventName: event.name,
      posterUrl: event.publicPosterUrl,
      inviteToken: tokenID.id,
      role: "Co-Host",
    };

    const { error: emailError } = await sendTeamInviteEmail(
      inviteEmail,
      emailPayload
    );

    if (emailError) {
      console.log(emailError);
    }

    toast.dismiss();
    toast.success("Invite sent");
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
            className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:items-center"
          >
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
            <Button type="submit" className="rounded-sm h-12 md:ml-2">
              <span>Invite</span>
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
