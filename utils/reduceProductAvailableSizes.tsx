import { ProductType } from "../types";

export const reduceProductAvailableSizes = (productType: ProductType) =>
  (productType?.products || []).reduce<string[]>((sizes, product) => {
    if (product.stock < 1) return sizes;
    return [...sizes, product.size];
  }, []);
