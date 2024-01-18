import createSupabaseServerClient from "@/utils/supabase/server";
import Image from "next/image";
import EmptyImage from "@/components/icons/EmptyImage";
import { MoreHorizontal } from "lucide-react";
import { Tables } from "@/types/supabase";
import { validateUser } from "@/lib/actions/auth";
import { User } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Upload from "./Upload";

export default async function Page() {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await validateUser();
  const user = userData.user as User;

  const { data: portfolioData, error: portfolioError } = await supabase
    .from("portfolio_pictures")
    .select("*")
    .eq("user_id", user.id);

  const portfolio: Tables<"portfolio_pictures">[] = portfolioData || [];

  // get public urls for each picture
  const getPortfolioPictures = async () => {
    const imagePromises = portfolio.map(async (picture) => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from("portfolios")
        .getPublicUrl(picture.picture_url);
      return { publicUrl, id: picture.id, picture_url: picture.picture_url };
    });
    const portfolioPictures = await Promise.all(imagePromises);
    return portfolioPictures;
  };

  const handleDelete = async (picture_url: string) => {
    "use server";
    const supabase = await createSupabaseServerClient();
    await supabase.storage.from("portfolios").remove([picture_url]);
    await supabase
      .from("portfolio_pictures")
      .delete()
      .eq("picture_url", picture_url);
    revalidatePath("/profile/portfolio");
  };

  const portfolioPictures = await getPortfolioPictures();
  const emptyImages = Array.from({ length: 6 - portfolioPictures.length });
  return (
    <main className="w-full max-w-6xl m-auto">
      <h1 className="font-bold text-2xl w-full mb-10">My Photos</h1>
      <div className="grid grid-cols-3 gap-2 m-auto">
        {portfolioPictures.map((picture, index) => (
          <div className="relative group h-full w-full" key={index}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="z-20">
                <MoreHorizontal className="text-black absolute top-4 right-4 hover:cursor-pointer bg-white rounded-full" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="absolute right-[-12px]">
                <form
                  action={async () => {
                    "use server";
                    await handleDelete(picture.picture_url);
                  }}
                >
                  <Button className="w-full rounded-md" variant={"destructive"}>
                    Delete
                  </Button>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
            <Image
              className="w-full h-full rounded-md"
              width={400}
              height={400}
              src={picture.publicUrl}
              alt="portfolio image"
            />
          </div>
        ))}
        {emptyImages.map((_, index) => (
          <Upload user={user} key={index} />
        ))}
      </div>
    </main>
  );
}
