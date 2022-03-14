import { CartItem, ProductItem } from "../types";

const LOCAL_STORAGE_CART_KEY = "zoal-cart-content";

export const getCartContentFromLocalStorage = (): CartItem[] => {
  if (typeof window !== "undefined") {
    const content = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
    return content ? JSON.parse(content) : [];
  }
  return [];
};

export const addItemToCart = (item: CartItem) => {
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
export const removeItemFromCart = (
  itemId: CartItem["id"],
  createdAt: CartItem["createdAt"]
): CartItem[] => {
  if (typeof window !== "undefined") {
    const currentCartContent = getCartContentFromLocalStorage();
    const newContent = [
      ...(currentCartContent || []).filter(
        (x) => x.id !== itemId && x.createdAt !== createdAt
      ),
    ];
    localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(newContent));
    return getCartContentFromLocalStorage() || [];
  }
  return [];
};
