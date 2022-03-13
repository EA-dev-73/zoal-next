import { supabase } from "../utils/supabaseClient";

export const getProducts = async () => {
  const { data: products } = await supabase.from("product").select(`
      id, name, createdAt,
      productCategory (id, name),
      productItem (id, productId, size, price, inStock)
  `);
  return products;
};
