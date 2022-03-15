import { countBy, groupBy } from "lodash";
import { ProductWithTypeAndQuantity, ProductWithTypeData } from "../types";
import { getCartContentFromLocalStorage } from "./localStorageHelpers";

export const addQuantityToProducts = (
  products: ProductWithTypeData[]
): ProductWithTypeAndQuantity[] => {
  const productIdsInCart = getCartContentFromLocalStorage();
  const productOccurences = countBy(productIdsInCart);
  return products.map((product) => ({
    ...product,
    quantity: productOccurences[product.id],
  }));
};
