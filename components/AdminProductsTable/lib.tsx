import {
  createProductTypeWithCategory,
  deleteProductType,
  updateCategoryAndProductType,
} from "../../api/product";
import {
  OnRowDeletingEvent,
  OnRowEditingEvent,
  OnRowInsertingEvent,
} from "./types";

export const onRowInserting = async (e: OnRowInsertingEvent) => {
  try {
    await createProductTypeWithCategory({
      createCategoryData: {
        categoryName: e.data.categoryName,
      },
      createProductTypeData: {
        name: e.data.name,
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
    await updateCategoryAndProductType({
      id: e.oldData?.id,
      name: e.newData?.name,
      categoryId: e.oldData?.productCategory?.id,
      categoryName: e.newData?.categoryName,
    });
  } catch (error: any) {
    alert(error.message);
  }
};
