import { countBy } from "lodash";
import { fetchProductsFromIds } from "../../api/products/product";
import { Product } from "../../types";

export const generateStripePriceData = async (cartContent: Product["id"][]) => {
  const products = await fetchProductsFromIds(cartContent);
  const productOccurences = countBy(cartContent);

  return (products || []).map((product) => ({
    price_data: {
      currency: "eur",
      product_data: {
        name: `${product.productType.name} - Taille ${product.size}`,
      },
      unit_amount: product.price * 100, // en centimes
    },
    quantity: productOccurences[product.id],
  }));
};
