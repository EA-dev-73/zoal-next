import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reactQueryKeys } from "../../react-query-keys";
import { ProductType, UpdateEntityNameDTO } from "../../types";
import { handlePostgresError } from "../../utils/handleError";
import { supabase } from "../../utils/supabaseClient";
import { TableConstants } from "../../utils/TableConstants";
import { useProductTypesImages } from "../images";
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

export const fetchProductTypeById = async (
  productTypeId: ProductType["id"]
): Promise<ProductType | null> => {
  const { data: product, error } = await supabase
    .from(TableConstants.productType)
    .select(
      `
        id, name, createdAt,
        productCategory (id, name),
        products (id, productTypeId, size, price, stock, shippingFees)
    `
    )
    .eq("id", productTypeId);
  error && handlePostgresError(error);
  return product?.[0] as ProductType | null;
};

export const useUpsertProductType = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ categoryId, name }: CreateProductTypeDTO) => {
      if (!categoryId || !name) return { data: null, error: null };
      const { data, error } = await supabase
        .from(TableConstants.productType)
        .upsert(
          {
            name: name,
            categoryId: categoryId,
          },
          {
            onConflict: "name",
          }
        );
      return { data, error };
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries();
      },
    }
  );
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

export const updateProductTypeWithCategory = async (
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

type UpdateProductTypeNameDTO = UpdateEntityNameDTO<ProductType>;

export const useUpdateProductTypeName = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ name, id }: UpdateProductTypeNameDTO) => {
      await supabase
        .from(TableConstants.productType)
        .update({ name })
        .match({ id });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries();
      },
    }
  );
};

export const useProductTypes = () =>
  useQuery([reactQueryKeys.productTypes], fetchProductTypes);

export const useProductTypesWithImages = () => {
  const { data: productTypes, isLoading: isLoadingProductTypes } =
    useProductTypes();
  const { data: dicImagesUrls, isLoading: isLoadingImages } =
    useProductTypesImages({
      productsTypesIds: (productTypes || []).map((x) => x.id),
    });

  return {
    productTypesWithImages: (productTypes || []).map((product) => ({
      ...product,
      imagesUrls: dicImagesUrls?.[product.id],
    })),
    isLoading: isLoadingProductTypes || isLoadingImages,
  };
};
