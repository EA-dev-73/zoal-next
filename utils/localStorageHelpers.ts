import { Product } from "../types";

const LOCAL_STORAGE_CART_KEY = "zoal-cart-content";

export const getCartContentFromLocalStorage = (): Product["id"][] => {
  if (typeof window !== "undefined") {
    const content = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
    return content ? JSON.parse(content) : [];
  }
  return [];
};

export const addProductIdToCart = (itemId: Product["id"]) => {
  if (typeof window !== "undefined") {
    const currentCartContent = getCartContentFromLocalStorage();
    localStorage.setItem(
      LOCAL_STORAGE_CART_KEY,
      JSON.stringify([...currentCartContent, itemId])
    );
  }
};

export const removeItemFromCart = (selectedItemId: Product["id"]): void => {
  if (typeof window !== "undefined") {
    const cartContent = getCartContentFromLocalStorage();
    const idxToRemove = cartContent.findIndex((x) => x === selectedItemId);
    cartContent.splice(idxToRemove, 1);
    localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cartContent));
  }
};
