import createSupabaseServerClient from "@/utils/supabase/server";
import Image from "next/image";
import { Tables } from "@/types/supabase";

export default async function Portfolio({ user }: { user: any }) {
  const supabase = await createSupabaseServerClient();
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
      return { publicUrl, id: picture.id };
    });

    const portfolioPictures = await Promise.all(imagePromises);
    return portfolioPictures;
  };

  const portfolioPictures = await getPortfolioPictures();

  return (
    <div className="grid grid-cols-3 gap-2">
      {portfolioPictures?.length != 0 ? (
        portfolioPictures.map((picture, index) => (
          <div className="relative aspect-square group" key={index}>
            <Image
              className="w-full h-full rounded-md"
              width={400}
              height={400}
              src={picture.publicUrl}
              alt="portfolio image"
            />
          </div>
        ))
      ) : (
        <div className="absolute"> No Photos Yet</div>
      )}
    </div>
  );
}
