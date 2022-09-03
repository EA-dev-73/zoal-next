import { useMemo } from "react";
import { useCategories } from "../api/category";
import {
  useBucketImagesPublicUrlsDic,
  useListImagesForProductsTypes,
  useProductTypesImages,
} from "../api/images";
import { useProductTypes } from "../api/products/product-type";

export const usePreloadData = () => {
  useCategories();
  const { data: productTypes } = useProductTypes();
  const productsTypesIds = useMemo(
    () => (productTypes || []).map((x) => x.id),
    [productTypes]
  );
  useProductTypesImages({
    productsTypesIds,
  });
  const { dic } = useListImagesForProductsTypes({
    productsTypesIds,
  });
  useBucketImagesPublicUrlsDic({
    imagesPerProductDic: dic,
    productsTypesIds,
  });
};
