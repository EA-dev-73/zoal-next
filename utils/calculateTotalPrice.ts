import { ProductWithTypeAndQuantity } from "../types";

export const calculateTotalPrice = (
  productsWithQuantity: ProductWithTypeAndQuantity[]
) =>
  productsWithQuantity.reduce((acc, item) => {
    if (item.stock > 0) return acc + item.price * item.quantity;
    return acc;
  }, 0);
