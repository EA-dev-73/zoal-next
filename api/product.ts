import { supabase } from "../utils/supabaseClient";
import { Category, Product, ProductType, ProductWithTypeData } from "../types";
import { uniq } from "lodash";
import { upsertCategory, CreateCategoryDTO } from "./category";
import { handlePostgresError } from "../utils/handleError";

export const fetchProductTypes = async (): Promise<ProductType[] | null> => {
  const { data: products, error } = await supabase.from("productType").select(`
      id, name, createdAt, imageUrl,
      productCategory (id, name),
      products (id, productTypeId, size, price, stock)
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
    id, productTypeId, size, price, stock,
    productType (id, name)
    `
    )
    .in("id", uniq(productIds));
  return products;
};

export type CreateProductTypeDTO = {
  name: ProductType["name"];
  categoryId: Category["id"];
};

export const upsertProductType = async (
  createProductTypeData: CreateProductTypeDTO
) => {
  const { data, error } = await supabase.from("productType").upsert(
    {
      name: createProductTypeData.name,
      categoryId: createProductTypeData.categoryId,
    },
    {
      onConflict: "name",
    }
  );
  return {
    data,
    error,
  };
};

type CreateProductTypeWithCategoryParams = {
  createCategoryData: CreateCategoryDTO;
  createProductTypeData: Omit<CreateProductTypeDTO, "categoryId">;
};

export const createProductTypeWithCategory = async ({
  createCategoryData,
  createProductTypeData,
}: CreateProductTypeWithCategoryParams) => {
  // Upsert de la catégorie
  const { data, error } = await upsertCategory(createCategoryData);
  error && handlePostgresError(error);
  const newCategoryId = data?.[0]?.id;

  if (!newCategoryId) {
    throw new Error("Something went wrong while creating a new category");
  }
  // Upsert du product type
  const { error: productTypeError } = await upsertProductType({
    categoryId: newCategoryId,
    name: createProductTypeData.name,
  });

  productTypeError && handlePostgresError(productTypeError);
};
