import { supabase } from "../utils/supabaseClient";
import { BucketsConstants } from "../utils/TableConstants";

export const uploadProductImageToBuket = async (image: File) => {
  const { data, error } = await supabase.storage
    .from(BucketsConstants.products)
    .upload(`${image.name.replaceAll(" ", "_")}`, image, {
      cacheControl: "3600",
      upsert: false,
    });
  error && console.log("ERREUR", error.message);
};

export const uploadProductImagesToBuket = async (images: File[]) => {
  for (const image of images) {
    await uploadProductImageToBuket(image);
  }
};
