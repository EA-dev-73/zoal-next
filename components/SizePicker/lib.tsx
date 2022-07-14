import { Product, ProductType } from "../../types";

export const getStock = (productType: ProductType, size: Product["size"]) => {
  const product = productType.products.find((product) => product.size === size);
  if (!product) return 0;
  return product?.stock;
};

export const displaySize = (size: Product["size"], stock: number) => {
  if (stock > 0) return size;
  return `${size} - Rupture de stock`;
};
