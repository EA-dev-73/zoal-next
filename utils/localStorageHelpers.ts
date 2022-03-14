import { ProductItem } from "../types";

const LOCAL_STORAGE_CART_KEY = "zoal-cart-content";

export const getCartContentFromLocalStorage = (): ProductItem[] | null => {
  if (typeof window !== "undefined") {
    const content = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
    console.log(content);
    return content ? JSON.parse(content) : null;
  }
  return null;
};

export const addItemToCard = (item: ProductItem) => {
  if (typeof window !== "undefined") {
    const currentCartContent = getCartContentFromLocalStorage();
    localStorage.setItem(
      LOCAL_STORAGE_CART_KEY,
      JSON.stringify(
        currentCartContent ? [...currentCartContent, item] : [item]
      )
    );
  }
};
