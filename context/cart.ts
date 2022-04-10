import { atom } from "recoil";
import { Product } from "../types";
import { getCartContentFromLocalStorage } from "../utils/localStorageHelpers";

const getCartContentStateDefaultValue = () => {
  //TODO virer le && getCartContentFromLocalStorage et regarder pourquoi ca fait une erreur apres cancel un stripe checkout
  if (typeof window !== "undefined" && getCartContentFromLocalStorage) {
    const cartContent = getCartContentFromLocalStorage();
    if (!cartContent?.length) return [];
    return cartContent;
  } else return [];
};

export const cartState = atom<Product["id"][]>({
  key: "cartState", // unique ID (with respect to other atoms/selectors)
  default: getCartContentStateDefaultValue(), // default value (aka initial value)
});
