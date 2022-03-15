import { supabase } from "../utils/supabaseClient";
import { Product, ProductType, ProductWithTypeData } from "../types";
import { uniq } from "lodash";

export const fetchProductTypes = async (): Promise<ProductType[] | null> => {
  const { data: products, error } = await supabase.from("productType").select(`
      id, name, createdAt, imageUrl,
      productCategory (id, name),
      products (id, productTypeId, size, price, inStock)
  `);
  console.error(error);
  return products;
};

export const fetchProductsFromIds = async (
  productIds: Product["id"][]
): Promise<ProductWithTypeData[] | null> => {
  const { data: products } = await supabase
    .from("products")
    .select(
      `
    id, productTypeId, size, price, inStock,
    productType (id, name)
    `
    )
    .in("id", uniq(productIds));
  return products;
};
