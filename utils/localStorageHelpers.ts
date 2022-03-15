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
    const itemToRemove = cartContent.find((x) => x === selectedItemId);
    if (!itemToRemove) {
      console.error(
        "L'item que l'on souhaite supprimé du cart n'a pas été trouvé 🤔"
      );
      return;
    }
    localStorage.setItem(
      LOCAL_STORAGE_CART_KEY,
      JSON.stringify(cartContent.filter((x) => x !== itemToRemove))
    );
  }
};
