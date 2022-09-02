import { useRouter } from "next/router";
import { useRecoilState, useResetRecoilState } from "recoil";
import { cartState } from "../context/cart";
import { userState } from "../context/user";
import { Product } from "../types";

export const LOCAL_STORAGE_CART_KEY = "zoal-cart-content";

export const clearLocalStorageCart = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(LOCAL_STORAGE_CART_KEY);
  }
};

export const getCartContentFromLocalStorage = (): Product["id"][] => {
  if (typeof window !== "undefined") {
    const content = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
    return content ? JSON.parse(content) : [];
  }
  return [];
};

export const useAddProductIdToCart = () => {
  const [cartContent, setCartContent] = useRecoilState(cartState);
  return (itemId: Product["id"], quantity = 1) => {
    const newCartContent = [...cartContent, ...Array(quantity).fill(itemId)];
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
      localStorage.setItem(
        LOCAL_STORAGE_CART_KEY,
        JSON.stringify(newCartContent)
      );
      setCartContent(newCartContent);
    }
  };
};

export const useLogOut = () => {
  const router = useRouter();
  const resetState = useResetRecoilState(userState);
  return () => {
    localStorage.removeItem("supabase.auth.token");
    resetState;
    router.reload();
  };
};
