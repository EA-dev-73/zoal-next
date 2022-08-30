import { useUpdateCategoryName } from "../../../api/category";
import { useUploadProductTypeImagesToBucket } from "../../../api/images";
import { useUpdateProductTypeName } from "../../../api/products/product-type";
import { displayToast } from "../../../utils/displayToast";
import { OnRowEditingEvent } from "../types";

export const useOnRowUpdating = () => {
  const { mutateAsync: updateCategoryName } = useUpdateCategoryName();
  const { mutateAsync: updateProductTypeName } = useUpdateProductTypeName();
  const { mutateAsync: uploadProductImagesToBuket } =
    useUploadProductTypeImagesToBucket();

  const onRowUpdating = async (e: OnRowEditingEvent, images: FileList) => {
    const [productTypeId, productTypeName] = [e.oldData?.id, e.newData?.name];
    const [categoryId, categoryName] = [
      e.oldData?.productCategory?.id,
      e.newData?.categoryName,
    ];

    // update category

    if (categoryId && categoryName) {
      const { error: errorUpdatingCategory } = await updateCategoryName({
        id: categoryId,
        name: categoryName,
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
