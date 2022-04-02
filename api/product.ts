import { supabase } from "../utils/supabaseClient";
import {
  Category,
  Product,
  ProductImage,
  ProductType,
  ProductWithTypeData,
} from "../types";
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
      productTypeImage(id, imageUrl)
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
  imagesUrl: string;
}>;

export type CreateProductTypeImagesDTO = {
  imagesUrl: ProductImage["imageUrl"][];
};

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
export const cleanAndInsertProductTypeImages =
  async (createProductTypeImagesData: {
    imageUrls: ProductImage["imageUrl"][] | null;
    productTypeId: ProductType["id"];
  }) => {
    // on vide les images actuelles de ce produit
    const { error: deletingError } = await supabase
      .from(TableConstants.productTypeImage)
      .delete()
      .eq("productTypeId", createProductTypeImagesData.productTypeId);

    deletingError && handlePostgresError(deletingError);
    if (!createProductTypeImagesData?.imageUrls?.length) return;
    // on insert ensuite les images
    const { error } = await supabase
      .from(TableConstants.productTypeImage)
      .insert(
        createProductTypeImagesData.imageUrls.map((x) => ({
          imageUrl: x,
          productTypeId: createProductTypeImagesData.productTypeId,
        }))
      );
    return {
      error,
    };
  };

type CreateProductTypeWithCategoryAndImagesParams = {
  createCategoryData: CreateCategoryDTO;
  createProductTypeData: Omit<CreateProductTypeDTO, "categoryId">;
  createProductTypeImages: CreateProductTypeImagesDTO;
};

export const createProductTypeWithCategoryAndImages = async ({
  createCategoryData,
  createProductTypeData,
  createProductTypeImages,
}: CreateProductTypeWithCategoryAndImagesParams) => {
  // Upsert de la catégorie
  const { data, error } = await upsertCategory(createCategoryData);
  error && handlePostgresError(error);
  const newCategoryId = data?.[0]?.id;

  if (!newCategoryId) {
    throw new Error("Something went wrong while creating a new category");
  }
  // Upsert du product type
  const { data: returningProductType, error: productTypeError } =
    await upsertProductType({
      categoryId: newCategoryId,
      name: createProductTypeData.name,
    });
  productTypeError && handlePostgresError(productTypeError);
  // on retourne l'id productType fraichement créé
  if (!createProductTypeImages?.imagesUrl?.length) return;

  const productTypeId = returningProductType?.[0]?.id;
  if (!productTypeId) {
    throw new Error("Erreur lors de la création du produit :/");
  }
  //filouterie car on recoi des array d'images mais l'edit renvoi une string
  const imagesUrl = createProductTypeImages.imagesUrl as unknown as string;

  await cleanAndInsertProductTypeImages({
    imageUrls: imagesUrl.split(","),
    productTypeId,
  });
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
    imagesUrl,
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

  if (productTypeId) {
    await cleanAndInsertProductTypeImages({
      imageUrls: imagesUrl?.length ? imagesUrl?.split(",") : null,
      productTypeId,
    });
  }
  return;
};
