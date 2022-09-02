import { useCallback, useEffect, useMemo } from "react";
import { useRecoilValue } from "recoil";
import { useFetchProductsFromIds } from "../api/products/product";
import { cartState } from "../context/cart";
import { Product } from "../types";
import { addQuantityToProducts } from "./addItemsQuantityToProducts";
import { displayToast } from "./displayToast";
import { useRemoveItemFromCart } from "./localStorageHelpers";

export const useProductsForCart = () => {
  const cartContent = useRecoilValue(cartState);

  const { data: rawProducts } = useFetchProductsFromIds(cartContent);
  const removeItemFromCart = useRemoveItemFromCart();

  const getDeletedProductsIds = useCallback(() => {
    if (!cartContent?.length || !rawProducts?.length) return;
    return (cartContent || []).reduce<number[]>(
      (deletedProductsIds, productId) => {
        if ((rawProducts || []).some((x) => x.id === productId))
          return deletedProductsIds;
        return [...deletedProductsIds, productId];
      },
      []
    );
  }, [cartContent, rawProducts]);

  const deletedProductsIds = useMemo(
    () => getDeletedProductsIds(),
    [getDeletedProductsIds]
  );

  useEffect(() => {
    if (deletedProductsIds?.length) {
      displayToast({
        type: "warning",
        message: "Certains articles de votre panier ne sont plus disponible",
      });

      for (const productId of deletedProductsIds) {
        removeItemFromCart(productId);
      }
    }
  }, [deletedProductsIds, removeItemFromCart]);

  const withQuantity = useMemo(
    () => addQuantityToProducts(rawProducts || []),
    [rawProducts]
  );

  const amountOfProductInLocalStorage = (productId: Product["id"]) =>
    cartContent.filter((id) => id === productId).length;
  const hasQuantityError = (withQuantity || []).some(
    (product) => product.stock < amountOfProductInLocalStorage(product.id)
  );

  return {
    loadingProducts: !withQuantity,
    products: withQuantity,
    quantityError: hasQuantityError,
    hasDeletedProducts: getDeletedProductsIds,
  };
};
