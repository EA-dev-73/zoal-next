import { PostgrestError } from "@supabase/supabase-js";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { reactQueryKeys } from "../react-query-keys";
import { DeleteProductImagesFromBucketDTO, ProductType } from "../types";
import { handlePostgresError } from "../utils/handleError";
import { supabase } from "../utils/supabaseClient";
import { BucketsConstants } from "../utils/TableConstants";

export const useUploadProductTypeImagesToBucket = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({
      productTypeId,
      images,
    }: {
      productTypeId: ProductType["id"];
      images: File[];
    }) => {
      for (const image of images) {
        await supabase.storage
          .from(BucketsConstants.products)
          .upload(
            `${productTypeId}/${image.name.replaceAll(" ", "_")}`,
            image,
            {
              cacheControl: "3600",
              upsert: false,
            }
          );
      }
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
  const queryClient = useQueryClient();
  const queryFn = (productTypeId: ProductType["id"]) =>
    supabase.storage
      .from(BucketsConstants.products)
      .list(String(productTypeId), {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

  const res = useQueries({
    queries: productsTypesIds.map((productTypeId) => ({
      queryKey: [reactQueryKeys.listImages, productTypeId],
      queryFn: () => queryFn(productTypeId),
    })),
  });

  const dic: Record<ProductType["id"], any> = (productsTypesIds || []).reduce(
    (acc, productTypeId) => {
      const getProductIdData = () => {
        const data = queryClient.getQueryData<any>([
          reactQueryKeys.listImages,
          productTypeId,
        ]);
        return data?.data;
      };
      acc[productTypeId] = {
        ...acc[productTypeId],
        ...getProductIdData(),
      };
      return acc;
    },
    {} as any
  );

  return {
    dic,
    res,
  };
};

export const useBucketImagesPublicUrlsDic = ({
  productsTypesIds,
  imagesPerProductDic,
}: {
  productsTypesIds: ProductType["id"][];
  imagesPerProductDic: Record<number, any> | undefined;
}) => {
  if (!productsTypesIds?.length) return {};
  const queryFn = (productTypeId: ProductType["id"], imageName: string) =>
    supabase.storage
      .from(BucketsConstants.products)
      .getPublicUrl(`${productTypeId}/${imageName}`);

  return (productsTypesIds || []).reduce<Record<ProductType["id"], any>>(
    (dic, productTypeId) => {
      const imagesPerProduct = Object.values(
        imagesPerProductDic?.[productTypeId]
      );
      return {
        ...dic,
        [productTypeId]: (imagesPerProduct || []).reduce<(string | null)[]>(
          (accImg: (string | null)[], image: any) => [
            ...accImg,
            queryFn(productTypeId, image.name).publicURL,
          ],
          []
        ),
      };
    },
    {}
  );
};

export const useProductTypesImages = ({
  productsTypesIds,
}: {
  productsTypesIds: ProductType["id"][];
}) => {
  const { dic, res } = useListImagesForProductsTypes({ productsTypesIds });

  const isLoadingImages = res.some((x) => x.isLoading);

  const dicImagesUrls = useBucketImagesPublicUrlsDic({
    productsTypesIds,
    imagesPerProductDic: dic,
  });

  return {
    data: dicImagesUrls,
    isLoading: isLoadingImages,
  };
};

export const useDeleteImages = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (
      deleteProductImagesFromBucketDTO: DeleteProductImagesFromBucketDTO
    ) => {
      for (const deleteProductImageFromBucketDTO of deleteProductImagesFromBucketDTO) {
        await supabase.storage
          .from(BucketsConstants.products)
          .remove([
            `${deleteProductImageFromBucketDTO.productTypeId}/${deleteProductImageFromBucketDTO.imageName}`,
          ]);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries();
      },
    }
  );
};

export const deleteAllImagesForProductType = async (
  productTypeId: ProductType["id"]
) => {
  const { mutate: deleteImages } = useDeleteImages();
  // const { data: images } = useListImagesForProductsTypes({
  //   productsTypesIds: [productTypeId],
  // });
  //TODO
  let images: any[] = [];

  const productImages = images?.[productTypeId];

  if (!productImages?.length) return;

  deleteImages(
    productImages.map((image: any) => ({
      productTypeId,
      imageName: image.name,
    }))
  );
};
