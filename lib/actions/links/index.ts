"use server";
import createSupabaseServerClient from "@/utils/supabase/server";

interface LinkType {
  username: string;
  application: string;
  type: string;
}

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
    .update(link)
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

export { createLink, createLinks, updateLink, updateLinks, deleteLinks };
