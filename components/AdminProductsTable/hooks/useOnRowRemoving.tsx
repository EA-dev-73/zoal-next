import { useDeleteAllImagesForProductType } from "../../../api/images";
import { useDeleteProduct } from "../../../api/products/product";
import { useDeleteProductType } from "../../../api/products/product-type";
import { ProductType } from "../../../types";
import { displayToast } from "../../../utils/displayToast";
import { OnRowDeletingEvent } from "../types";

export const useOnRowRemoving = (productTypeId: ProductType["id"]) => {
  const { mutateAsync: deleteProductType } = useDeleteProductType();
  const { deleteAllImagesForProductType } =
    useDeleteAllImagesForProductType(productTypeId);

  const onRowRemoving = async (e: OnRowDeletingEvent) => {
    const productTypeId = e.data.id;

    const { data: deletedProductType, error: errorDeletingProductType } =
      await deleteProductType(productTypeId);

    if (errorDeletingProductType) {
      displayToast({
        message: `Error lors de la suppréssion du produit type : ${errorDeletingProductType.message}`,
        type: "error",
      });
      return;
    } else {
      displayToast({
        message: `Produit type : ${deletedProductType?.[0]?.name} supprimé`,
        type: "success",
      });
    }

    deleteAllImagesForProductType();
  };

  return { onRowRemoving };
};
