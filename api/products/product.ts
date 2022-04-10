import { supabase } from "../../utils/supabaseClient";
import { Product, ProductWithTypeData } from "../../types";
import { uniq } from "lodash";
import { TableConstants } from "../../utils/TableConstants";
import { handlePostgresError } from "../../utils/handleError";
import { DeleteProductDTO, UpsertProductDTO } from "./types";

export const fetchProductsFromIds = async (
  productIds: Product["id"][]
): Promise<ProductWithTypeData[] | null> => {
  const { data: products, error } = await supabase
    .from(TableConstants.products)
    .select(
      `
    id, productTypeId, size, price, stock, shippingFees,
    productType (id, name)
    `
    )
    .in("id", uniq(productIds));
  error && handlePostgresError(error);
  return products;
};

export const deleteProduct = async (deleteProductData: DeleteProductDTO) => {
  const { error } = await supabase
    .from(TableConstants.products)
    .delete()
    .eq("id", deleteProductData.productId);
  error && handlePostgresError(error);
};

export const upsertProduct = async (upsertProductData: UpsertProductDTO) => {
  const { error } = await supabase.from(TableConstants.products).upsert(
    {
      id: upsertProductData.productId,
      size: upsertProductData.size,
      stock: upsertProductData.stock,
      price: upsertProductData.price,
      shippingFees: upsertProductData.shippingFees,
      productTypeId: upsertProductData.productTypeId,
    },
    {
      onConflict: "id",
    }
  );
  error && handlePostgresError(error);
};
