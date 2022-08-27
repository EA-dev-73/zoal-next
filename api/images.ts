import { PostgrestError } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { reactQueryKeys } from "../react-query-keys";
import { DeleteProductImagesFromBucketDTO, ProductType } from "../types";
import { handlePostgresError } from "../utils/handleError";
import { supabase } from "../utils/supabaseClient";
import { BucketsConstants } from "../utils/TableConstants";

export const useUploadProductTypeImageToBucket = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({
      productTypeId,
      image,
    }: {
      productTypeId: ProductType["id"];
      image: File;
    }) => {
      await supabase.storage
        .from(BucketsConstants.products)
        .upload(`${productTypeId}/${image.name.replaceAll(" ", "_")}`, image, {
          cacheControl: "3600",
          upsert: false,
        });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries();
      },
      onError: (err: PostgrestError) => handlePostgresError(err),
    }
  );
};

export const useListImagesForProductsTypes = ({
  productsTypesIds,
}: {
  productsTypesIds: ProductType["id"][];
}) => {
  return useQuery(
    reactQueryKeys.listImages,
    () => {
      if (!productsTypesIds?.length) return {};
      return productsTypesIds.reduce<Record<ProductType["id"], any>>(
        (acc, productTypeId) => {
          supabase.storage
            .from(BucketsConstants.products)
            .list(String(productTypeId), {
              limit: 100,
              offset: 0,
              sortBy: { column: "name", order: "asc" },
            })
            .then((images) => {
              acc[productTypeId] = images.data;
            });
          return acc;
        },
        {}
      );
    },
    {
      enabled: !!productsTypesIds?.length,
    }
  );
};

export const useBucketImagesPublicUrlsDic = ({
  productsTypesIds,
  imagesPerProductDic,
}: {
  productsTypesIds: ProductType["id"][];
  imagesPerProductDic: Record<number, any> | undefined;
}) => {
  return useQuery(
    reactQueryKeys.bucketImagePublicUrl,
    () => {
      return productsTypesIds.reduce<Record<ProductType["id"], string[]>>(
        (acc, productTypeId) => {
          console.log({
            imagePerProduct: imagesPerProductDic?.[productTypeId],
          });
          {
            acc[productTypeId] = (
              imagesPerProductDic?.[productTypeId] || []
            ).reduce((accImage: any, image: any) => {
              const { data } = supabase.storage
                .from(BucketsConstants.products)
                .getPublicUrl(`${productTypeId}/${image.name}`);
              accImage[productTypeId] = [
                ...accImage[productTypeId],
                data?.publicURL,
              ];
              return accImage;
            }, []);
          }
          return acc;
        },
        {}
      );
    },
    {
      enabled: !!productsTypesIds?.length,
    }
  );
};

export const useProductTypesImages = ({
  productsTypesIds,
}: {
  productsTypesIds: ProductType["id"][];
}) => {
  const { data: images } = useListImagesForProductsTypes({ productsTypesIds });
  const { data: dicImagesUrls } = useBucketImagesPublicUrlsDic({
    productsTypesIds,
    imagesPerProductDic: images,
  });
  return { dicImagesUrls };
};

export const deleteImages = async (
  deleteProductImagesFromBucketDTO: DeleteProductImagesFromBucketDTO
) => {
  for (const deleteProductImageFromBucketDTO of deleteProductImagesFromBucketDTO) {
    const { error } = await supabase.storage
      .from(BucketsConstants.products)
      .remove([
        `${deleteProductImageFromBucketDTO.productTypeId}/${deleteProductImageFromBucketDTO.imageName}`,
      ]);
    error && console.log("ERREUR2", error.message);
  }
};

export const deleteAllImagesForProductType = async (
  productTypeId: ProductType["id"]
) => {
  const { data: images } = useListImagesForProductsTypes({
    productsTypesIds: [productTypeId],
  });

  const productImages = images?.[productTypeId];

  if (!productImages?.length) return;

  await deleteImages(
    productImages.map((image: any) => ({
      productTypeId,
      imageName: image.name,
    }))
  );
};
