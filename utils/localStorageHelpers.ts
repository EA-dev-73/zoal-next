import { CartItem, ProductItem } from "../types";

const LOCAL_STORAGE_CART_KEY = "zoal-cart-content";

export const getCartContentFromLocalStorage = (): CartItem[] => {
  if (typeof window !== "undefined") {
    const content = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
    return content ? JSON.parse(content) : [];
  }
  return [];
};

export const addItemToCart = (item: Omit<CartItem, "quantity">) => {
  if (typeof window !== "undefined") {
    const cartContent = getCartContentFromLocalStorage();
    const itemAlreadyInCart = cartContent.find(
      (x) => x.productId === item.productId && x.id === item.id
    );
    if (itemAlreadyInCart) {
      itemAlreadyInCart.quantity += 1;
      localStorage.setItem(
        LOCAL_STORAGE_CART_KEY,
        JSON.stringify([...cartContent])
      );
    } else {
      localStorage.setItem(
        LOCAL_STORAGE_CART_KEY,
        JSON.stringify([...cartContent, { ...item, quantity: 1 }])
      );
    }
  }
};
export const removeItemFromCart = (selectedItem: CartItem): CartItem[] => {
  if (typeof window !== "undefined") {
    const cartContent = getCartContentFromLocalStorage();
    const itemToRemove = cartContent.find(
      (x) => x.productId === selectedItem.productId && x.id === selectedItem.id
    );
    if (!itemToRemove) {
      console.error(
        "L'item que l'on souhaite supprimé du cart n'a pas été trouvé 🤔"
      );
      return cartContent;
    }
    if (itemToRemove?.quantity > 1) {
      itemToRemove.quantity -= 1;
      localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cartContent));
    } else {
      const itemToRemove = cartContent.find(
        (x) =>
          x.id === selectedItem.id && x.productId === selectedItem.productId
      );
      localStorage.setItem(
        LOCAL_STORAGE_CART_KEY,
        JSON.stringify(cartContent.filter((x) => x !== itemToRemove))
      );
    }
  }
  return getCartContentFromLocalStorage();
};
