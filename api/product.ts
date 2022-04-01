import { supabase } from "../utils/supabaseClient";
import { Category, Product, ProductType, ProductWithTypeData } from "../types";
import { uniq } from "lodash";
import { upsertCategory, CreateCategoryDTO } from "./category";
import { handlePostgresError } from "../utils/handleError";
import { TableConstants } from "../utils/TableConstants";

export const fetchProductTypes = async (): Promise<ProductType[] | null> => {
  const { data: products, error } = await supabase.from(
    TableConstants.productType
  ).select(`
      id, name, createdAt,
      productCategory (id, name),
      products (id, productTypeId, size, price, stock),
      productTypeImage(id, imageName)
  `);
  console.error(error);
  return products;
};

export const fetchProductsFromIds = async (
  productIds: Product["id"][]
): Promise<ProductWithTypeData[] | null> => {
  const { data: products } = await supabase
    .from(TableConstants.products)
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
export type UpdateCategoryAndProductTypeDTO = Partial<{
  id: ProductType["id"];
  categoryId: Category["id"];
  categoryName: ProductType["productCategory"]["name"];
  name: ProductType["name"];
}>;

export const upsertProductType = async (
  createProductTypeData: CreateProductTypeDTO
) => {
  const { data, error } = await supabase
    .from(TableConstants.productType)
    .upsert(
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

export const deleteProductType = async (productTypeId: ProductType["id"]) => {
  //TODO supprimer la categorie si plus de productType associés

  // suppression des images associées

  const { error: imagesError } = await supabase
    .from(TableConstants.productTypeImage)
    .delete()
    .eq("productTypeId", productTypeId);

  imagesError && handlePostgresError(imagesError);

  //TODO delete images from server

  const { data, error } = await supabase
    .from(TableConstants.productType)
    .delete()
    .eq("id", productTypeId);
  return {
    data,
    error,
  };
};

export const updateCategoryAndProductType = async (
  newData: UpdateCategoryAndProductTypeDTO
) => {
  const {
    id: productTypeId,
    name: productTypeName,
    categoryName,
    categoryId,
  } = newData;

  if (categoryName) {
    const { error } = await supabase
      .from(TableConstants.productCategory)
      .update({ name: categoryName })
      .match({ id: categoryId });

    error && handlePostgresError(error);
  }

  if (productTypeName) {
    const { error } = await supabase
      .from(TableConstants.productType)
      .update({ name: productTypeName })
      .match({ id: productTypeId });
    error && handlePostgresError(error);
  }
  return;
};
