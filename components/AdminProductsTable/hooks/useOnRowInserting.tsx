import { useUpsertCategory } from "../../../api/category";
import { useUploadProductTypeImagesToBucket } from "../../../api/images";
import { useUpsertProductType } from "../../../api/products/product-type";
import { displayToast } from "../../../utils/displayToast";
import { OnRowInsertingEvent } from "../types";

export const useOnRowInserting = () => {
  const { mutateAsync: upsertCategory } = useUpsertCategory();
  const { mutateAsync: upsertProductType } = useUpsertProductType();
  const { mutateAsync: uploadProductImagesToBuket } =
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
      return;
    } else {
      displayToast({
        message: `Catégorie : ${createdCategory?.[0]?.name} créée`,
        type: "success",
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
        message: `Error lors de la création du produit type : ${errorCreatingProductType.message}`,
        type: "error",
      });
      return;
    } else {
      displayToast({
        message: `Produit type : ${createdProductType?.[0]?.name} créé`,
        type: "success",
      });
    }

    // upload images

    const productTypeId = createdProductType?.[0]?.id;

    const imagesArr = Array.from(images || []);

    await uploadProductImagesToBuket({
      images: imagesArr,
      productTypeId,
    });

    // if (errors?.length) {
    //   displayToast({
    //     message: `Error lors de l'upload d'une ou plusieurs images`,
    //     type: "error",
    //   });
    //   return;
    // }
  };

  return { onRowInserting };
};
