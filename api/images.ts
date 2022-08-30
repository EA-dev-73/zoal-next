import { PostgrestError } from "@supabase/supabase-js";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { reactQueryKeys } from "../react-query-keys";
import { DeleteProductImageFromBucketDTO, ProductType } from "../types";
import { displayToast } from "../utils/displayToast";
import { handlePostgresError } from "../utils/handleError";
import { supabase } from "../utils/supabaseClient";
import { BucketsConstants } from "../utils/TableConstants";

export const useUploadProductTypeImagesToBucket = () => {
  const queryClient = useQueryClient();
  //TODO fix return (rien n'est allData et errors non retournées pour le moment)
  return useMutation(
    async ({
      productTypeId,
      images,
    }: {
      productTypeId: ProductType["id"];
      images: File[];
    }) => {
      const { allData, errors } = (images || []).reduce<{
        allData: any[];
        errors: any[];
      }>(
        ({ allData, errors }, image) => {
          supabase.storage
            .from(BucketsConstants.products)
            .upload(
              `${productTypeId}/${image.name.replaceAll(" ", "_")}`,
              image,
              {
                cacheControl: "3600",
                upsert: false,
              }
            )
            .then(({ data, error }) => {
              return {
                allData: data,
                error: error,
              };
            });
          return { allData, errors };
        },
        { allData: [], errors: [] }
      );
      return { allData, errors };
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
      notifyOnChangeProps: Array(productsTypesIds?.length).fill("data"),
      enabled: !!productsTypesIds?.length,
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
      if (!imagesPerProductDic?.[productTypeId])
        return {
          ...dic,
          [productTypeId]: [],
        };
      const imagesPerProduct =
        Object.values(imagesPerProductDic?.[productTypeId]) || [];
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

export const useDeleteImage = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ imageName, productTypeId }: DeleteProductImageFromBucketDTO) => {
      await supabase.storage
        .from(BucketsConstants.products)
        .remove([`${productTypeId}/${imageName}`]);
    },
    {
      onSuccess: (_, { productTypeId, imageName }) => {
        const currentImages = queryClient.getQueryData([
          reactQueryKeys.listImages,
          productTypeId,
        ]);

        const filteredImages = (currentImages as unknown as any)?.data.filter(
          (x: any) => x.name !== imageName
        );
        queryClient.setQueryData(
          [reactQueryKeys.listImages, productTypeId],
          filteredImages
        );

        queryClient.refetchQueries();

        displayToast({
          type: "success",
          message: `Image ${imageName} supprimée`,
        });
      },
    }
  );
};

export const useDeleteAllImagesForProductType = (
  productTypeId: ProductType["id"]
) => {
  const { dic } = useListImagesForProductsTypes({
    productsTypesIds: [productTypeId],
  });
  const { mutate: deleteImage } = useDeleteImage();

  const productImages = dic?.[productTypeId];

  if (!productImages?.length)
    return {
      deleteAllImagesForProductType: () => {},
    };

  const imagesToDelete = productImages.map((image: any) => ({
    productTypeId,
    imageName: image.name,
  }));

  const deleteImages = (imagesToDelete: any) => {
    for (const image of imagesToDelete) {
      deleteImage(image);
    }
  };

  return {
    deleteAllImagesForProductType: () => deleteImages(imagesToDelete),
  };
};
