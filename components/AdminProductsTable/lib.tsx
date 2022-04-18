import { useEffect, useState } from "react";
import {
  createProductTypeWithCategoryAndImages,
  deleteProductType,
  fetchProductTypesWithImages,
  updateProductTypeWithCategoryAndImages,
} from "../../api/products/product-type";
import { ProductTypeWithImages } from "../../types";
import {
  OnRowDeletingEvent,
  OnRowEditingEvent,
  OnRowInsertingEvent,
} from "./types";

export type ProductForAdminTable = ProductTypeWithImages & {
  categoryName: string;
};

export const useProductsForAdminTable = () => {
  const [products, setProducts] = useState<ProductForAdminTable[]>([]);
  useEffect(() => {
    fetchProductTypesWithImages().then((productTypes) => {
      const formatted = (productTypes || []).map((productType) => ({
        ...productType,
        categoryName: productType.productCategory.name,
      }));
      setProducts(formatted);
    });
  }, []);

  return products || [];
};

export const onRowInserting = async (
  e: OnRowInsertingEvent,
  images: FileList
) => {
  try {
    await createProductTypeWithCategoryAndImages({
      createCategoryData: {
        categoryName: e.data.categoryName,
      },
      createProductTypeData: {
        name: e.data.name,
      },
      createProductTypeImages: {
        images,
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
    await updateProductTypeWithCategoryAndImages({
      id: e.oldData?.id,
      name: e.newData?.name,
      categoryId: e.oldData?.productCategory?.id,
      categoryName: e.newData?.categoryName,
      // imagesUrl: e.newData?.imagesUrl,
    });
  } catch (error: any) {
    alert(error.message);
  }
};
