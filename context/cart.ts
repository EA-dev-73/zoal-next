import { atom } from "recoil";
import { Product } from "../types";
import { getCartContentFromLocalStorage } from "../utils/localStorageHelpers";

const getCartContentStateDefaultValue = () => {
  if (typeof window !== "undefined") {
    const cartContent = getCartContentFromLocalStorage();
    if (!cartContent?.length) return [];
    return cartContent;
  } else return [];
};

export const cartState = atom<Product["id"][]>({
  key: "cartState", // unique ID (with respect to other atoms/selectors)
  default: getCartContentStateDefaultValue(), // default value (aka initial value)
});
