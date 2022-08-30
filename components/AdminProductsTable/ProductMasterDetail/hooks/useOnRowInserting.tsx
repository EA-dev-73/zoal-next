import { useUpsertProduct } from "../../../../api/products/product";
import { Product, ProductType } from "../../../../types";
import { displayToast } from "../../../../utils/displayToast";

type DxProductRowInsert = {
  data: Partial<
    Pick<Product, "price" | "shippingFees" | "size" | "stock" | "id">
  >;
};

export const useOnRowInserting = () => {
  const { mutateAsync: upsertProduct } = useUpsertProduct();

  const onRowInserting = async (
    e: DxProductRowInsert,
    productTypeId: ProductType["id"]
  ) => {
    const { data, error } = await upsertProduct({
      price: e.data.price,
      productId: e.data.id,
      shippingFees: e.data.shippingFees,
      size: e.data.size,
      stock: e.data.stock,
      productTypeId,
    });

    const productSize = data?.[0]?.size;

    if (error) {
      displayToast({
        message: `Error lors de la création du produit en taille ${productSize}`,
        type: "error",
      });
      return;
    } else {
      displayToast({
        message: `Produit créé en taille ${productSize}`,
        type: "success",
      });
    }
  };

  return { onRowInserting };
};
