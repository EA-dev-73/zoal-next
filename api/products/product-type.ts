import {
  CreateProductTypeWithCategoryAndImagesParams,
  ProductType,
  ProductTypeWithImages,
} from "../../types";
import { handlePostgresError } from "../../utils/handleError";
import { supabase } from "../../utils/supabaseClient";
import { TableConstants } from "../../utils/TableConstants";
import { upsertCategory } from "../category";
import { getProductsImagesDictionnary } from "../images";
import { CreateProductTypeDTO, UpdateCategoryAndProductTypeDTO } from "./types";

export const fetchProductTypes = async (): Promise<ProductType[] | null> => {
  const { data: products, error } = await supabase.from(
    TableConstants.productType
  ).select(`
        id, name, createdAt,
        productCategory (id, name),
        products (id, productTypeId, size, price, stock, shippingFees)
    `);
  error && handlePostgresError(error);
  return products;
};

export const fetchProductTypesWithImages = async (): Promise<
  ProductTypeWithImages[]
> => {
  const products = await fetchProductTypes();
  const images = await getProductsImagesDictionnary(
    (products || []).map((x) => x.id)
  );
  return (products || []).map((product) => ({
    ...product,
    imagesUrls: images[product.id],
  }));
};

export const fetchProductTypeById = async (
  productTypeId: ProductType["id"]
): Promise<ProductType | null> => {
  const { data: product, error } = await supabase
    .from(TableConstants.productType)
    .select(
      `
        id, name, createdAt,
        productCategory (id, name),
        products (id, productTypeId, size, price, stock, shippingFees),
    `
    )
    .eq("id", productTypeId);
  error && handlePostgresError(error);
  return product?.[0] as ProductType | null;
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

export const createProductTypeWithCategoryAndImages = async ({
  createCategoryData,
  createProductTypeData,
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
  // if (!createProductTypeImages?.imagesUrl?.length) return;
  // const productTypeId = returningProductType?.[0]?.id;
  // if (!productTypeId) {
  //   throw new Error("Erreur lors de la création du produit :/");
  // }
  // //filouterie car on recoi des array d'images mais l'edit renvoi une string
  // const imageBucketKey =
  //   createProductTypeImages.imageBucketKey as unknown as string;
  // await cleanAndInsertProductTypeImages({
  //   imageBucketKey: imageBucketKey.split(","),
  //   productTypeId,
  // });
};

export const deleteProductType = async (productTypeId: ProductType["id"]) => {
  //TODO supprimer la categorie si plus de productType associés

  // suppression des images associées

  //TODO supprimer les images du bucket

  // const { error: imagesError } = await supabase
  //   .from(TableConstants.productTypeImage)
  //   .delete()
  //   .eq("productTypeId", productTypeId);

  // imagesError && handlePostgresError(imagesError);

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

export const updateProductTypeWithCategoryAndImages = async (
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

  // if (productTypeId) {
  //   await cleanAndInsertProductTypeImages({
  //     imageBucketKey: imageBucketKey?.length
  //       ? imageBucketKey?.split(",")
  //       : null,
  //     productTypeId,
  //   });
  // }
  return;
};
