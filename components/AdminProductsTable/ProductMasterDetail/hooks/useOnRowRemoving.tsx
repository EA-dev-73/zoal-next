import { useDeleteProduct } from "../../../../api/products/product";
import { Product } from "../../../../types";
import { displayToast } from "../../../../utils/displayToast";

export const useOnRowRemoving = () => {
  const { mutateAsync: deleteProduct } = useDeleteProduct();
  const onRowRemoving = async (productId: Product["id"]) => {
    const { data, error } = await deleteProduct({
      productId,
    });

    const productSize = data?.[0]?.size;

    if (error) {
      displayToast({
        message: `Error lors de la suppression du produit en taille ${productSize}`,
        type: "error",
      });
      return;
    } else {
      displayToast({
        message: `Produit de taille ${productSize} supprimé`,
        type: "success",
      });
    }
  };

  return { onRowRemoving };
};
