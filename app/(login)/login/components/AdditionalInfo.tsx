import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { addAdditionalInfo } from "@/lib/actions/profile";
import { validateUser } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

const formSchema = z.object({
  firstName: z.string().min(1, {
    message: "Please enter your first name",
  }),
  lastName: z.string().min(1, {
    message: "Please enter your last name",
  }),
});

export default function AdditionalInfo() {
  const { replace } = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const {
      data: { user },
    } = await validateUser();
    if (!user) {
      return;
    }
    setSubmitting(true);
    toast.loading("Saving...");
    await addAdditionalInfo(values, user.id);
    toast.dismiss();
    toast.success("Saved!");
    replace("/");
    setSubmitting(false);
  };

  return (
    <motion.div
      key="additional-info"
      initial={{ opacity: 0, y: 5 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay: 0.7 },
      }}
      className="flex flex-col space-y-6"
    >
      <h1 className="font-semibold text-xl">Help us get to know you better.</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FloatingLabelInput
                    id="first-name"
                    label="First Name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FloatingLabelInput
                    id="last-name"
                    label="Last Name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={submitting}
            className="w-full rounded-md"
            type="submit"
          >
            Get started
          </Button>
          <div className="flex justify-center">
            <Link className="block m-auto" href="/">
              Skip
            </Link>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}
