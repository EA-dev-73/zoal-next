import type { AppProps } from "next/app";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { cartState } from "../context/cart";
import { getCartContentFromLocalStorage } from "../utils/localStorageHelpers";
import { usePreloadData } from "../utils/usePreloadData";

export const Container = ({ Component, ...pageProps }: AppProps) => {
  const setCart = useSetRecoilState(cartState);
  usePreloadData();

  useEffect(() => {
    const localStorageContent = getCartContentFromLocalStorage();
    setCart(localStorageContent);
  }, [setCart]);

  //@ts-ignore
  return <Component {...pageProps} />;
};
