import { createClient } from "@/utils/supabase/client";
import { CreateEvent } from "../../schema";
import { AllEventData } from "../../page";

const uploadFileToBucket = async (file: File, storageFolder: string) => {
  const supabase = createClient();
  if (file) {
    const fileExtension = file.name.split(".").pop();
    const { data } = await supabase.storage
      .from(storageFolder)
      .upload(`${storageFolder}${Date.now()}.${fileExtension}`, file);

    if (data) {
      return data.path;
    }
  }
  return null;
};

const deleteFileFromBucket = async (filePath: string, bucket: string) => {
  const supabase = createClient();
  await supabase.storage.from(bucket).remove([filePath]);
};

const handleImagesUpload = async (
  values: CreateEvent,
  originalDraft: AllEventData | null
) => {
  let updatedValues = { ...values };

  updatedValues.venueMap = values.venueMap
    ? values.venueMap
    : "venue_map_coming_soon";
  updatedValues.poster = values.poster ? values.poster : "poster_coming_soon";

  if (values.poster instanceof File) {
    const posterPath = await uploadFileToBucket(values.poster, "posters");
    if (
      originalDraft?.poster_url &&
      originalDraft?.poster_url !== "poster_coming_soon"
    ) {
      await deleteFileFromBucket(originalDraft?.poster_url, "posters");
    }
    updatedValues.poster = posterPath || "poster_coming_soon";

    if (originalDraft) {
      originalDraft.poster_url = updatedValues.poster;
    }
  }

  if (values.venueMap instanceof File) {
    const venueMapPath = await uploadFileToBucket(
      values.venueMap,
      "venue_maps"
    );
    if (
      originalDraft?.venue_map_url &&
      originalDraft?.venue_map_url !== "venue_map_coming_soon"
    ) {
      await deleteFileFromBucket(originalDraft?.venue_map_url, "venue_maps");
    }
    updatedValues.venueMap = venueMapPath || "venue_map_coming_soon";

    if (originalDraft) {
      originalDraft.venue_map_url = updatedValues.venueMap;
    }
  }

  return updatedValues;
};

export { handleImagesUpload };
