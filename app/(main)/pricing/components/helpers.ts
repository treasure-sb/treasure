"use server";

import { validateUser } from "@/lib/actions/auth";
import { redirect } from "next/navigation";

export const isUserLogged = async () => {
  const user = (await validateUser()).data.user !== null;
  return user;
};
