import { ProductType, ProductTypeImage } from "../../types";
import { handlePostgresError } from "../../utils/handleError";
import { supabase } from "../../utils/supabaseClient";
import { TableConstants } from "../../utils/TableConstants";

export const cleanAndInsertProductTypeImages =
  async (createProductTypeImagesData: {
    imageBucketKey: ProductTypeImage["imageBucketKey"][] | null;
    productTypeId: ProductType["id"];
  }) => {
    // on vide les images actuelles de ce produit
    const { error: deletingError } = await supabase
      .from(TableConstants.productTypeImage)
      .delete()
      .eq("productTypeId", createProductTypeImagesData.productTypeId);

    deletingError && handlePostgresError(deletingError);
    if (!createProductTypeImagesData?.imageBucketKey?.length) return;
    // on insert ensuite les images
    const { error } = await supabase
      .from(TableConstants.productTypeImage)
      .insert(
        createProductTypeImagesData.imageBucketKey.map((x) => ({
          imageBucketKey: x,
          productTypeId: createProductTypeImagesData.productTypeId,
        }))
      );
    return {
      error,
    };
  };
