"use server";
import createSupabaseServerClient from "@/utils/supabase/server";
import { Tables } from "@/types/supabase";

interface LinkType {
  username: string;
  application: string;
  type: string;
}

const getSocialLinks = async (user_id: string) => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", user_id)
    .eq("type", "social");

  const links: Tables<"links">[] = data || [];
  return { links, error };
};

const getPaymentLinks = async (user_id: string) => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", user_id)
    .eq("type", "payment");

  const links: Tables<"links">[] = data || [];
  return { links, error };
};

const createLink = async (user_id: string, username: string, type: string) => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("links")
    .insert([{ user_id, username, type }])
    .select();

  return { data, error };
};

const createLinks = async (links: LinkType[], user_id: string) => {
  const supabase = await createSupabaseServerClient();
  const linksWithUserId = links.map((link) => ({ ...link, user_id }));
  const { data, error } = await supabase
    .from("links")
    .insert(linksWithUserId)
    .select();
  return { data, error };
};

const updateLink = async (link: LinkType, user_id: string) => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("links")
    .upsert(link)
    .eq("application", link.application)
    .eq("user_id", user_id);
  return { data, error };
};

const updateLinks = async (links: LinkType[], user_id: string) => {
  const updateLinksPromise = links.map(async (link) => {
    await updateLink(link, user_id);
  });
  await Promise.all(updateLinksPromise);
};

const deleteLinks = async (links: any[], user_id: string) => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("links")
    .delete()
    .in(
      "application",
      links.map((link) => link.application)
    )
    .eq("user_id", user_id);
  return { data, error };
};

export {
  getSocialLinks,
  getPaymentLinks,
  createLink,
  createLinks,
  updateLink,
  updateLinks,
  deleteLinks,
};
