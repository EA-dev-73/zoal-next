import { addQuantityToProducts } from "./addItemsQuantityToProducts";
import { calculateTotalPrice } from "./calculateTotalPrice";
import { useProductsForCart } from "./cart";

export const useCalculateCartTotalPrice = () => {
  const { loadingProducts, products, quantityError } = useProductsForCart();

  const productsWithTypeAndQuantity = addQuantityToProducts(products || []);
  const totalPrice = calculateTotalPrice(productsWithTypeAndQuantity);

  return {
    loadingProducts,
    totalPrice,
    quantityError,
  };
};
