import { useMemo } from "react";
import { useUpdateCategoryName, useUpsertCategory } from "../../api/category";
import {
  deleteAllImagesForProductType,
  useUploadProductTypeImagesToBucket,
} from "../../api/images";
import {
  deleteProductType,
  useProductTypesWithImages,
  useUpdateProductTypeName,
  useUpsertProductType,
} from "../../api/products/product-type";
import { ProductTypeWithImages } from "../../types";
import {
  OnRowDeletingEvent,
  OnRowEditingEvent,
  OnRowInsertingEvent,
} from "./types";
import { displayToast } from "../../utils/displayToast";

export type ProductForAdminTable = ProductTypeWithImages & {
  categoryName: string;
};

export const useProductsForAdminTable = () => {
  const { productTypesWithImages, isLoading } = useProductTypesWithImages();

  const products = useMemo(() => {
    return (productTypesWithImages || []).map((productType) => ({
      ...productType,
      categoryName: productType.productCategory.name,
    }));
  }, [productTypesWithImages]);

  return { products, isLoading };
};

export const useOnRowInserting = () => {
  const { mutateAsync: upsertCategory } = useUpsertCategory();
  const { mutateAsync: upsertProductType } = useUpsertProductType();
  const { mutate: uploadProductImagesToBuket } =
    useUploadProductTypeImagesToBucket();

  const onRowInserting = async (e: OnRowInsertingEvent, images: FileList) => {
    // create category
    const { data: createdCategory, error: errorCreatingCategory } =
      await upsertCategory({
        categoryName: e.data.categoryName,
      });

    if (errorCreatingCategory) {
      displayToast({
        message: `Error lors de la création de la catégorie : ${errorCreatingCategory.message}`,
        type: "error",
      });
    }

    // create product type
    const categoryId = createdCategory?.[0]?.id;
    const { data: createdProductType, error: errorCreatingProductType } =
      await upsertProductType({
        categoryId,
        name: e.data.name,
      });

    if (errorCreatingProductType) {
      displayToast({
        message: `Error lors de la création du produit : ${errorCreatingProductType.message}`,
        type: "error",
      });
    }

    // upload images

    const productTypeId = createdProductType?.[0]?.id;

    const imagesArr = Array.from(images || []);

    uploadProductImagesToBuket({
      images: imagesArr,
      productTypeId,
    });
  };

  return { onRowInserting };
};

export const onRowRemoving = async (e: OnRowDeletingEvent) => {
  const productTypeId = e.data.id;
  try {
    await deleteProductType(productTypeId);
    await deleteAllImagesForProductType(productTypeId);
  } catch (error: any) {
    alert(error.message);
  }
};

export const useOnRowUpdating = () => {
  const { mutate: updateCategoryName } = useUpdateCategoryName();
  const { mutate: updateProductTypeName } = useUpdateProductTypeName();
  const { mutate: uploadProductImagesToBuket } =
    useUploadProductTypeImagesToBucket();

  const onRowUpdating = (e: OnRowEditingEvent, images: FileList) => {
    const [productTypeId, productTypeName] = [e.oldData?.id, e.newData?.name];
    const [categoryId, categoryName] = [
      e.oldData?.productCategory?.id,
      e.newData?.categoryName,
    ];

    // update category

    if (categoryId && categoryName) {
      updateCategoryName({
        id: categoryId,
        name: categoryName,
      });
    }

    // update product type

    if (!productTypeId) {
      alert("⚠️⚠️ Il manque le  productTypeId... voir avec tommy");
      return;
    }

    if (productTypeName) {
      updateProductTypeName({
        id: productTypeId,
        name: productTypeName,
      });
    }

    const imagesArr = Array.from(images || []);

    if (!imagesArr?.length) return;

    // upload images

    uploadProductImagesToBuket({
      images: imagesArr,
      productTypeId,
    });
  };

  return { onRowUpdating };
};
