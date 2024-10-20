import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { config } from "dotenv";
import path from "path";
import fs from "fs";

config({ path: ".env.local" });

const SUPABASE_SERVICE_KEY = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY;

async function insertPosters() {
  const supabase = createClient(
    "http://localhost:54321",
    SUPABASE_SERVICE_KEY as string,
    {
      auth: { persistSession: false },
    }
  );

  const imagePath = path.join(process.cwd(), "supabase", "images", "posters");
  const files = fs.readdirSync(imagePath);

  for (const file of files) {
    const fileContent = readFileSync(path.join(imagePath, file));
    const fileName = file.includes("poster_coming_soon")
      ? "poster_coming_soon"
      : file;

    const { error } = await supabase.storage
      .from("posters")
      .upload(fileName, fileContent, {
        contentType: "image/jpg",
      });

    if (error) {
      console.error("Error uploading image", error);
    }
  }
}

async function insertVenueMapPlaceholder() {
  const supabase = createClient(
    "http://localhost:54321",
    SUPABASE_SERVICE_KEY as string,
    {
      auth: { persistSession: false },
    }
  );

  const imagePath = path.join(
    process.cwd(),
    "supabase",
    "images",
    "venue_maps"
  );
  const fileContent = readFileSync(
    path.join(imagePath, "venue_map_coming_soon.png")
  );

  const { error } = await supabase.storage
    .from("venue_maps")
    .upload("venue_map_coming_soon", fileContent, {
      contentType: "image/png",
    });

  if (error) {
    console.error("Error uploading image", error);
  }
}

async function insertAvatars() {
  const supabase = createClient(
    "http://localhost:54321",
    SUPABASE_SERVICE_KEY as string,
    {
      auth: { persistSession: false },
    }
  );

  const imagePath = path.join(process.cwd(), "supabase", "images", "avatars");
  const files = fs.readdirSync(imagePath);
  const filterDefaultAvatar = files.filter(
    (file) => file !== "default_avatar.png"
  );
  for (const file of filterDefaultAvatar) {
    const fileContent = readFileSync(path.join(imagePath, file));

    const { error } = await supabase.storage
      .from("avatars")
      .upload(file, fileContent, {
        contentType: "image/jpg",
      });

    if (error) {
      console.error("Error uploading image", error);
    }
  }

  const defaultAvatarFileContent = readFileSync(
    path.join(imagePath, "default_avatar.png")
  );
  const { error } = await supabase.storage
    .from("avatars")
    .upload("default_avatar", defaultAvatarFileContent, {
      contentType: "image/png",
    });

  if (error) {
    console.error("Error uploading image", error);
  }
}

insertAvatars();
insertPosters();
insertVenueMapPlaceholder();
