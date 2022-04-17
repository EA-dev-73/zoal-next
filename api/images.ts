import { ProductType } from "../types";
import { supabase } from "../utils/supabaseClient";
import { BucketsConstants } from "../utils/TableConstants";

export const uploadProductImageToBuket = async (
  productTypeId: ProductType["id"],
  image: File
) => {
  const { data, error } = await supabase.storage
    .from(BucketsConstants.products)
    .upload(`${productTypeId}/${image.name.replaceAll(" ", "_")}`, image, {
      cacheControl: "3600",
      upsert: false,
    });
  error && console.log("ERREUR", error.message);
};

type UploadProductImagesToBucketDTO = {
  productTypeId: ProductType["id"];
  image: File;
}[];

export const uploadProductImagesToBucket = async (
  uploadProductImagesToBucketDTO: UploadProductImagesToBucketDTO
) => {
  for (const uploadProductImageToBucketDTO of uploadProductImagesToBucketDTO) {
    await uploadProductImageToBuket(
      uploadProductImageToBucketDTO.productTypeId,
      uploadProductImageToBucketDTO.image
    );
  }
};

export const getProductImages = async (productTypeId: ProductType["id"]) => {
  const { data: imagesList, error: errorList } = await supabase.storage
    .from(BucketsConstants.products)
    .list(String(productTypeId), {
      limit: 100,
      offset: 0,
      sortBy: { column: "name", order: "asc" },
    });

  if (errorList) {
    console.log("ERROR", errorList);
    return [];
  }

  let images: string[] = [];

  for (const image of imagesList || []) {
    const { data, error } = supabase.storage
      .from(BucketsConstants.products)
      .getPublicUrl(`4821/${image.name}`);
    error && console.log("ERREUR", error.message);
    data && images.push(data?.publicURL);
  }
  return images;
};

export const getProductsImagesDictionnary = async (
  productIds: ProductType["id"][]
) => {
  let images: Record<number, string[]> = {};
  for (const productId of productIds) {
    const tmpImages = await getProductImages(productId);
    images[productId] = tmpImages;
  }
  return images;
};
