import { supabase } from "../utils/supabaseClient";
import { Product } from "../types";

export const getProducts = async (): Promise<Product[] | null> => {
  const { data: products } = await supabase.from("product").select(`
      id, name, createdAt,
      productCategory (id, name),
      productItem (id, productId, size, price, inStock)
  `);
  return products;
};
