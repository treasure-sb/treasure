import Image from "next/image";
import createSupabaseServerClient from "@/utils/supabase/server";
import Link from "next/link";
import { Tables } from "@/types/supabase";

export default async function Page({ params }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient();

  const { data: userData, error: userError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", params.id)
    .single();

  const user: Tables<"profiles"> = userData;

  const {
    data: { publicUrl },
  } = await supabase.storage.from("avatars").getPublicUrl(user.avatar_url);

  let instaLink = "https://www.instagram.com/" + user.instagram;
  let twitterLink = "https://www.twitter.com/" + user.twitter;

  return (
    <main className="m-auto max-w-lg">
      <div className="flex flex-col space-y-6 ">
        {user.avatar_url ? (
          <div className="h-28 w-28 rounded-full overflow-hidden m-auto">
            <Image
              className="block w-full h-full object-cover"
              alt="avatar"
              src={publicUrl}
              width={100}
              height={100}
            />
          </div>
        ) : null}
        <div className="text-2xl m-auto font-semibold text-center">
          @{user.username}
        </div>
        {user.instagram && (
          <Link
            className="flex text-base space-x-4 justify-center align-middle"
            href={instaLink}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 0H5C2.24 0 0 2.24 0 5V19C0 21.76 2.24 24 5 24H19C21.76 24 24 21.76 24 19V5C24 2.24 21.76 0 19 0ZM22 19C22 20.65 20.65 22 19 22H5C3.35 22 2 20.65 2 19V5C2 3.35 3.35 2 5 2H19C20.65 2 22 3.35 22 5V19Z"
                fill="white"
              />
              <path
                d="M12 5C8.14 5 5 8.14 5 12C5 15.86 8.14 19 12 19C15.86 19 19 15.86 19 12C19 8.14 15.86 5 12 5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17Z"
                fill="white"
              />
              <path
                d="M19 6C19.5523 6 20 5.55228 20 5C20 4.44772 19.5523 4 19 4C18.4477 4 18 4.44772 18 5C18 5.55228 18.4477 6 19 6Z"
                fill="white"
              />
            </svg>
            <h1>@{user.instagram}</h1>
          </Link>
        )}
        {user.twitter && (
          <Link
            className="flex text-base space-x-4 justify-center align-middle"
            href={twitterLink}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
                fill="white"
              />
            </svg>
            <h1>@{user.twitter}</h1>
          </Link>
        )}
      </div>
    </main>
  );
}
