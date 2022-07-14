import { deleteProduct, upsertProduct } from "../../../api/products/product";
import { Product, ProductType } from "../../../types";

type DxProductRowInsert = {
  data: Partial<
    Pick<Product, "price" | "shippingFees" | "size" | "stock" | "id">
  >;
};
type DxProductRowUpdate = {
  oldData: Product;
  newData: Partial<Pick<Product, "price" | "shippingFees" | "size" | "stock">>;
};

export const onRowInserting = async (
  e: DxProductRowInsert,
  productTypeId: ProductType["id"]
) => {
  try {
    await upsertProduct({
      price: e.data.price,
      productId: e.data.id,
      shippingFees: e.data.shippingFees,
      size: e.data.size,
      stock: e.data.stock,
      productTypeId,
    });
  } catch (error) {
    console.log(2, error);
  }
};
export const onRowUpdating = async (
  e: DxProductRowUpdate,
  productTypeId: ProductType["id"]
) => {
  try {
    await upsertProduct({
      productId: e.oldData.id,
      price: e.newData.price ?? e.oldData.price,
      shippingFees: e.newData.shippingFees ?? e.oldData.shippingFees,
      size: e.newData.size || e.oldData.size,
      stock: e.newData.stock ?? e.oldData.stock,
      productTypeId,
    });
  } catch (error) {
    console.log(3, error);
  }
};
export const onRowRemoving = async (productId: Product["id"]) => {
  try {
    await deleteProduct({
      productId,
    });
  } catch (error) {
    console.log(1, error);
  }
};
