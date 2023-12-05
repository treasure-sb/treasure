"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { signUp } from "@/lib/actions/auth";
import InstagramIcon from "@/components/icons/InstagramIcon";
import TwitterIcon from "@/components/icons/TwitterIcon";
import * as z from "zod";
import Link from "next/link";
import GoogleIcon from "@/components/icons/GoogleIcon";

const formSchema = z.object({
  username: z.string().min(1, {
    message: "Please enter a username",
  }),
  email: z.string().email({
    message: "Please enter a valid email",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
});

export default function Page() {
  const [addSocial, setAddSocial] = useState(false);
  const [emailExistsError, setEmailExistsError] = useState(false);
  const [userExistsError, setUserExistsError] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      instagram: "",
      twitter: "",
    },
  });

  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    try {
      const response = await signUp(formData);
      if (response?.error) {
        if (response.error.type === "username_taken") {
          setUserExistsError(true);
        } else if (response.error.type === "email_taken") {
          setEmailExistsError(true);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickSocials = () => {
    if (addSocial) {
      form.setValue("instagram", "");
      form.setValue("twitter", "");
    }
    setAddSocial(!addSocial);
  };

  return (
    <main className="px-4 mt-8 max-w-lg m-auto w-full">
      <h1 className="text-2xl text-center mb-4">Sign up</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Username" {...field} />
                </FormControl>
                <div className="h-1">
                  <FormMessage>
                    {userExistsError ? "Username already exists" : ""}
                  </FormMessage>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <div className="h-1">
                  <FormMessage>
                    {emailExistsError ? "Email already in use" : ""}
                  </FormMessage>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <div className="h-1">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          {addSocial && (
            <>
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center">
                        <InstagramIcon />
                        <Input placeholder="Instagram" {...field} />
                      </div>
                    </FormControl>
                    <div className="h-1">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center">
                        <TwitterIcon />
                        <Input placeholder="Twitter" {...field} />
                      </div>
                    </FormControl>
                    <div className="h-1">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </>
          )}
          <Button
            onClick={handleClickSocials}
            className="rounded-full tracking-wide"
            variant={"secondary"}
            type="button"
          >
            {addSocial ? "Clear Socials" : "Add Socials"}
          </Button>
          <Button className="w-full" type="submit">
            Sign Up
          </Button>
          <h1 className="text-center text-sm">
            Already have an account?{" "}
            <Link className="text-primary" href="/login">
              Log In
            </Link>
          </h1>
          <div className="flex items-center justify-center my-4">
            <hr className="flex-grow border-secondary" />
            <span className="mx-2">or</span>
            <hr className="flex-grow border-secondary" />
          </div>
          <Button
            type="button"
            className="bg-white w-full hover:bg-white space-x-2"
          >
            <GoogleIcon />
            <h1>Sign up with Google</h1>
          </Button>
        </form>
      </Form>
    </main>
  );
}
