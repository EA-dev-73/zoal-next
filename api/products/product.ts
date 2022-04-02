import { supabase } from "../../utils/supabaseClient";
import { Product, ProductWithTypeData } from "../../types";
import { uniq } from "lodash";
import { TableConstants } from "../../utils/TableConstants";
import { handlePostgresError } from "../../utils/handleError";

export const fetchProductsFromIds = async (
  productIds: Product["id"][]
): Promise<ProductWithTypeData[] | null> => {
  const { data: products, error } = await supabase
    .from(TableConstants.products)
    .select(
      `
    id, productTypeId, size, price, stock,
    productType (id, name)
    `
    )
    .in("id", uniq(productIds));
  error && handlePostgresError(error);
  return products;
};
