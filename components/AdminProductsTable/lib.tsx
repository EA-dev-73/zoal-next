import {
  createProductTypeWithCategoryAndImages,
  deleteProductType,
  updateCategoryAndProductType as updateCategoryAndProductTypeAndImages,
} from "../../api/product";
import {
  OnRowDeletingEvent,
  OnRowEditingEvent,
  OnRowInsertingEvent,
} from "./types";

export const onRowInserting = async (e: OnRowInsertingEvent) => {
  try {
    await createProductTypeWithCategoryAndImages({
      createCategoryData: {
        categoryName: e.data.categoryName,
      },
      createProductTypeData: {
        name: e.data.name,
      },
      createProductTypeImages: {
        imagesUrl: e.data.imagesUrl,
      },
    });
  } catch (error: any) {
    alert(error.message);
  }
};

export const onRowRemoving = async (e: OnRowDeletingEvent) => {
  try {
    await deleteProductType(e.data.id);
  } catch (error: any) {
    alert(error.message);
  }
};

export const onRowUpdating = async (e: OnRowEditingEvent) => {
  try {
    await updateCategoryAndProductTypeAndImages({
      id: e.oldData?.id,
      name: e.newData?.name,
      categoryId: e.oldData?.productCategory?.id,
      categoryName: e.newData?.categoryName,
      imagesUrl: e.newData?.imagesUrl,
    });
  } catch (error: any) {
    alert(error.message);
  }
};
