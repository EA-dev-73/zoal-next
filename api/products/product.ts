import { supabase } from "../../utils/supabaseClient";
import { Product, ProductType, ProductWithTypeData } from "../../types";
import { uniq } from "lodash";
import { TableConstants } from "../../utils/TableConstants";
import { handlePostgresError } from "../../utils/handleError";
import { DeleteProductDTO, UpsertProductDTO } from "./types";

export const getProductById = async (
  id: Product["id"]
): Promise<Product | null> => {
  const { data: product, error } = await supabase
    .from(TableConstants.products)
    .select(
      `
  id, productTypeId, size, price, stock, shippingFees
  `
    )
    .eq("id", id);
  error && handlePostgresError(error);
  return product?.[0];
};

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

/**
 *
 * Supabase ne supporte pas encore le patch, il faut donc passer plus de params que ce que l'on aimerai :(
 */
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

/**
 * Supabase ne supporte pas encore le patch, il faut donc passer plus de params que ce que l'on aimerai :(
 */
export const updateProductStock = async (
  productId: Product["id"],
  quantityToRemove: number,
  productTypeId: ProductType["id"],
  size: Product["size"],
  price: Product["price"]
) => {
  const product = await getProductById(productId);
  const newStock = (product?.stock || 0) - quantityToRemove;

  await upsertProduct({
    productId,
    stock: newStock < 0 ? 0 : newStock,
    productTypeId,
    size,
    price,
  });
};

type UpdateProductsStocksParams = {
  productId: Product["id"];
  quantityToRemove: number;
  productTypeId: ProductType["id"];
  size: Product["size"];
  price: Product["price"];
}[];

/**
 *
 * Supabase ne supporte pas encore le patch, il faut donc passer plus de params que ce que l'on aimerai :(
 */
export const updateProductsStocks = async (
  updateProductsStocksParams: UpdateProductsStocksParams
) => {
  for (const param of updateProductsStocksParams) {
    await updateProductStock(
      param.productId,
      param.quantityToRemove,
      param.productTypeId,
      param.size,
      param.price
    );
  }
};
