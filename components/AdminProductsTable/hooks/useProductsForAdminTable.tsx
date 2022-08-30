import { useMemo } from "react";
import { useProductTypesWithImages } from "../../../api/products/product-type";

export const useProductsForAdminTable = () => {
  const { productTypesWithImages, isLoading } = useProductTypesWithImages();

  const products = useMemo(() => {
    return (productTypesWithImages || []).map((productType) => ({
      ...productType,
      categoryName: productType.productCategory.name,
    }));
  }, [productTypesWithImages]);

  return { products, isLoading };
};
