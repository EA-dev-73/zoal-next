import { useCategories, useUpdateCategoryName } from "../../../api/category";
import {
  useProductTypes,
  useUpdateProductTypeName,
  useUpsertProductType,
} from "../../../api/products/product-type";
import { displayToast } from "../../../utils/displayToast";
import { OnRowEditingEvent } from "../types";

export const useOnRowUpdating = () => {
  const { data: existingCategories } = useCategories();
  const { data: existingProductTypes } = useProductTypes();
  const { mutateAsync: updateCategoryName } = useUpdateCategoryName();
  const { mutateAsync: updateProductTypeName } = useUpdateProductTypeName();
  const { mutateAsync: upsertProductType } = useUpsertProductType();

  const onRowUpdating = async (e: OnRowEditingEvent) => {
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
  };

  return { onRowUpdating };
};
