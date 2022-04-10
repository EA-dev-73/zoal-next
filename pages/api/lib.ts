import { Dictionary } from "lodash";
import { ProductWithTypeData } from "../../types";

export const generateStripePriceData = (
  products: ProductWithTypeData[] | null,
  productOccurences: Dictionary<number>
) => {
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

export const generateStripeShippingFees = (
  products: ProductWithTypeData[] | null
) => {
  // on prend le frais de port le plus élevé des produits
  const maxShippingFees: number = (products || []).reduce((max, current) => {
    if (current.shippingFees > max) return current.shippingFees;
    return max;
  }, 0);

  return [
    {
      shipping_rate_data: {
        type: "fixed_amount",
        fixed_amount: {
          amount: maxShippingFees * 100, // en centimes
          currency: "eur",
        },
        display_name: "Frais de livraisons",
        delivery_estimate: {
          minimum: {
            unit: "business_day",
            value: 5,
          },
          maximum: {
            unit: "business_day",
            value: 7,
          },
        },
      },
    },
  ];
};
