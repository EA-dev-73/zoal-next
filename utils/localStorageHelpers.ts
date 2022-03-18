import { Product } from "../types";

export const LOCAL_STORAGE_CART_KEY = "zoal-cart-content";

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

export const removeItemFromCart = (
  selectedProductId: Product["id"],
  inStock = true
): void => {
  if (typeof window !== "undefined") {
    const cartContent = getCartContentFromLocalStorage();
    if (!inStock) {
      // si il n'y a plus de stock on n'enleve pas les articles 1 par 1
      localStorage.setItem(
        LOCAL_STORAGE_CART_KEY,
        JSON.stringify(cartContent.filter((x) => x !== selectedProductId))
      );
      return;
    }
    const idxToRemove = cartContent.findIndex((x) => x === selectedProductId);
    cartContent.splice(idxToRemove, 1);
    localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cartContent));
  }
};
