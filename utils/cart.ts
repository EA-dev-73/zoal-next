import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { fetchProductsFromIds } from "../api/products/product";
import { cartState } from "../context/cart";
import { Product, ProductWithTypeAndQuantity } from "../types";
import { addQuantityToProducts } from "./addItemsQuantityToProducts";

export const useProductsForCart = () => {
  const cartContent = useRecoilValue(cartState);
  const [products, setProducts] = useState<ProductWithTypeAndQuantity[]>([]);
  const [quantityError, setQuantityError] = useState<boolean>(false);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    //TODO refacto
    fetchProductsFromIds(cartContent).then((products) => {
      setLoadingProducts(false);
      const withQuantity = addQuantityToProducts(products || []);
      setProducts(withQuantity);
      const amountOfProductInLocalStorage = (productId: Product["id"]) =>
        cartContent.filter((id) => id === productId).length;
      const hasQuantityError = (withQuantity || []).some(
        (product) => product.stock < amountOfProductInLocalStorage(product.id)
      );
      setQuantityError(hasQuantityError);
    });
  }, [cartContent]);

  return {
    loadingProducts,
    products,
    quantityError,
  };
};
