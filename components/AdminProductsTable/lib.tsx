import { useUpdateCategoryName } from "../../api/category";
import {
  deleteAllImagesForProductType,
  useUploadProductImagesToBucket,
} from "../../api/images";
import {
  createProductTypeWithCategoryAndImages,
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
  const productTypeWithImages = useProductTypesWithImages();
  return (productTypeWithImages || []).map((productType) => ({
    ...productType,
    categoryName: productType.productCategory.name,
  }));
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

export const useOnRowUpdating = () => {
  const { mutate: updateCategoryName } = useUpdateCategoryName();
  const { mutate: updateProductTypeName } = useUpdateProductTypeName();
  const { mutate: uploadProductImagesToBucket } =
    useUploadProductImagesToBucket();

  const onRowUpdating = (e: OnRowEditingEvent, images: FileList) => {
    const [productTypeId, productTypeName] = [e.oldData?.id, e.newData?.name];
    const [categoryId, categoryName] = [
      e.oldData?.productCategory?.id,
      e.newData?.categoryName,
    ];

    if (categoryId && categoryName) {
      updateCategoryName({
        id: categoryId,
        name: categoryName,
      });
    }

    if (productTypeId && productTypeName) {
      updateProductTypeName({
        id: productTypeId,
        name: productTypeName,
      });
    }

    const imagesArr = Array.from(images || []);

    if (!imagesArr?.length) return;

    if (!productTypeId) {
      const err = "Missing productTypeId..., voir avec tommy";
      console.log(err);
      alert(err);
    }

    uploadProductImagesToBucket(
      //@ts-ignore
      (imagesArr || []).map((image) => {
        return {
          productTypeId: e.oldData?.id,
          image,
        };
      })
    );
  };

  return { onRowUpdating };
};
