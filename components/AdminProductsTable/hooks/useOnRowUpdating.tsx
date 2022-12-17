import { useCategories, useUpdateCategoryName } from "../../../api/category";
import { useUploadProductTypeImagesToBucket } from "../../../api/images";
import {
  useProductTypes,
  useUpdateProductTypeName,
  useUpsertProductType,
} from "../../../api/products/product-type";
import { ProductType } from "../../../types";
import { displayToast } from "../../../utils/displayToast";
import { OnRowEditingEvent } from "../types";

export const useOnRowUpdating = () => {
  const { data: existingCategories } = useCategories();
  const { data: existingProductTypes } = useProductTypes();
  const { mutateAsync: updateCategoryName } = useUpdateCategoryName();
  const { mutateAsync: updateProductTypeName } = useUpdateProductTypeName();
  const { mutateAsync: upsertProductType } = useUpsertProductType();
  const { mutateAsync: uploadProductImagesToBuket } =
    useUploadProductTypeImagesToBucket();

  const onRowUpdating = async (e: OnRowEditingEvent, images: FileList) => {
    const [productTypeId, productTypeName] = [e.oldData?.id, e.newData?.name];
    const [categoryId, categoryName] = [
      e.oldData?.productCategory?.id,
      e.newData?.categoryName,
    ];

    // update category

    const categoryAlreadyExist = (existingCategories || []).find(
      (x) => x.name === categoryName
    );

    if (categoryId && categoryName) {
      const { error: errorUpdatingCategory } = await updateCategoryName({
        id: categoryAlreadyExist?.id || categoryId,
        name: categoryAlreadyExist?.name || categoryName,
      });
      if (errorUpdatingCategory) {
        displayToast({
          message: `Error lors de la modification de la catégorie : ${errorUpdatingCategory.message}`,
          type: "error",
        });
        return;
      }
    }

    // update product type

    if (!productTypeId) {
      displayToast({
        type: "error",
        message: "⚠️⚠️ Il manque le  productTypeId... voir avec tommy",
      });
      return;
    }
    if (productTypeName) {
      const { error: errorUpdatingProductType } = await updateProductTypeName({
        id: productTypeId,
        name: productTypeName,
      });
      if (errorUpdatingProductType) {
        displayToast({
          message: `Error lors de la modification du produit type : ${errorUpdatingProductType.message}`,
          type: "error",
        });
        return;
      }
    }
    const existingProductTypesForCategory = (existingProductTypes || []).filter(
      (x) => x.productCategory.id === categoryId
    );

    if (categoryAlreadyExist && existingProductTypesForCategory?.length) {
      for (const existingProductType of existingProductTypesForCategory) {
        await upsertProductType({
          categoryId: categoryAlreadyExist.id,
          name: existingProductType.name,
        });
      }
    }
    const imagesArr = Array.from(images || []);

    if (!imagesArr?.length) return;

    // upload images

    const { allData, errors } = await uploadProductImagesToBuket({
      images: imagesArr,
      productTypeId,
    });

    if (errors?.length) {
      displayToast({
        message: `Error lors de l'upload d'une ou plusieurs images`,
        type: "error",
      });
      return;
    }
  };

  return { onRowUpdating };
};

export const useOnRowImageUpdating = () => {
  const { mutateAsync: uploadProductImagesToBuket } =
    useUploadProductTypeImagesToBucket();
  const onRowImageUpdating = async ({
    productTypeId,
    images,
  }: {
    productTypeId: ProductType["id"];
    images: FileList;
  }) => {
    console.log("onRowImageUpdating", { productTypeId, images });
    const imagesArr = Array.from(images || []);

    if (!imagesArr?.length) return;

    const { errors } = await uploadProductImagesToBuket({
      images: imagesArr,
      productTypeId,
    });

    if (errors?.length) {
      displayToast({
        message: `Error lors de l'upload d'une ou plusieurs images`,
        type: "error",
      });
      return;
    }
  };
  return { onRowImageUpdating };
};
