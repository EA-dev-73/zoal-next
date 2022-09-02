import { useUpsertProduct } from "../../../../api/products/product";
import { Product, ProductType } from "../../../../types";
import { displayToast } from "../../../../utils/displayToast";

type DxProductRowUpdate = {
  oldData: Product;
  newData: Partial<Pick<Product, "price" | "shippingFees" | "size" | "stock">>;
};

export const useOnRowUpdating = () => {
  const { mutateAsync: upsertProduct } = useUpsertProduct();

  const onRowUpdating = async (
    e: DxProductRowUpdate,
    productTypeId: ProductType["id"]
  ) => {
    const { data, error } = await upsertProduct({
      productId: e.oldData.id,
      price: e.newData.price || e.oldData.price,
      shippingFees: e.newData.shippingFees ?? e.oldData.shippingFees,
      size: e.newData.size || e.oldData.size,
      stock: e.newData.stock ?? e.oldData.stock,
      productTypeId,
    });

    const productSize = data?.[0]?.size;

    if (error) {
      displayToast({
        message: `Error lors de la modification du produit en taille ${productSize}`,
        type: "error",
      });
      return;
    } else {
      displayToast({
        message: `Produit de taille ${productSize} modifié`,
        type: "success",
      });
    }
  };
  return { onRowUpdating };
};
