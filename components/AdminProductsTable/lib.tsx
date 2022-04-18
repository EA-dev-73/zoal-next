import { useEffect, useState } from "react";
import {
  deleteAllImagesForProductType,
  uploadProductImagesToBucket,
} from "../../api/images";
import {
  createProductTypeWithCategoryAndImages,
  deleteProductType,
  fetchProductTypesWithImages,
  updateProductTypeWithCategory,
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
  const productTypeId = e.data.id;
  try {
    await deleteProductType(productTypeId);
    await deleteAllImagesForProductType(productTypeId);
  } catch (error: any) {
    alert(error.message);
  }
};

export const onRowUpdating = async (e: OnRowEditingEvent, images: FileList) => {
  try {
    await updateProductTypeWithCategory({
      id: e.oldData?.id,
      name: e.newData?.name,
      categoryId: e.oldData?.productCategory?.id,
      categoryName: e.newData?.categoryName,
    });

    const imagesArr = Array.from(images || []);

    if (!imagesArr?.length) return;
    if (!e.oldData?.id) {
      const err = "Missing productTypeId..., voir avec tommy";
      console.log(err);
      alert(err);
    }
    await uploadProductImagesToBucket(
      //@ts-ignore
      (imagesArr || []).map((image) => {
        return {
          productTypeId: e.oldData?.id,
          image,
        };
      })
    );
  } catch (error: any) {
    alert(error.message);
  }
};
