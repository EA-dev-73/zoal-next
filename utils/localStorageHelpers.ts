import { useRecoilState, useResetRecoilState, useSetRecoilState } from "recoil";
import { cartState } from "../context/cart";
import { userState } from "../context/user";
import { Product } from "../types";

export const LOCAL_STORAGE_CART_KEY = "zoal-cart-content";

export const getCartContentFromLocalStorage = (): Product["id"][] => {
  if (typeof window !== "undefined") {
    const content = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
    return content ? JSON.parse(content) : [];
  }
  return [];
};

export const useAddProductIdToCart = () => {
  const [cartContent, setCartContent] = useRecoilState(cartState);
  return (itemId: Product["id"]) => {
    const newCartContent = [...cartContent, itemId];
    if (typeof window !== "undefined") {
      localStorage.setItem(
        LOCAL_STORAGE_CART_KEY,
        JSON.stringify(newCartContent)
      );
      setCartContent(newCartContent);
    }
  };
};

export const useRemoveItemFromCart = () => {
  const [cartContent, setCartContent] = useRecoilState(cartState);
  return (selectedProductId: Product["id"]) => {
    if (typeof window !== "undefined") {
      const idxToRemove = cartContent.findIndex((x) => x === selectedProductId);
      const newCartContent = cartContent.filter(
        (_, idx) => idx !== idxToRemove
      );
      console.log({ idxToRemove, cartContent, newCartContent });
      localStorage.setItem(
        LOCAL_STORAGE_CART_KEY,
        JSON.stringify(newCartContent)
      );
      setCartContent(newCartContent);
    }
  };
};

export const useLogOut = () => {
  const resetState = useResetRecoilState(userState);
  return () => {
    localStorage.removeItem("supabase.auth.token");
    resetState;
  };
};
