import { useMemo } from "react";
import { useUpdateCategoryName } from "../../api/category";
import {
  deleteAllImagesForProductType,
  useUploadProductTypeImagesToBucket,
} from "../../api/images";
import {
  deleteProductType,
  useProductTypesWithImages,
  useUpdateProductTypeName,
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
  const { productTypesWithImages } = useProductTypesWithImages();

  const products = useMemo(() => {
    return (productTypesWithImages || []).map((productType) => ({
      ...productType,
      categoryName: productType.productCategory.name,
    }));
  }, [productTypesWithImages]);

  return products;
};

export const onRowInserting = async (
  e: OnRowInsertingEvent,
  images: FileList
) => {
  // try {
  //   await createProductTypeWithCategoryAndImages({
  //     createCategoryData: {
  //       categoryName: e.data.categoryName,
  //     },
  //     createProductTypeData: {
  //       name: e.data.name,
  //     },
  //     createProductTypeImages: {
  //       images,
  //     },
  //   });
  // } catch (error: any) {
  //   alert(error.message);
  // }
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
