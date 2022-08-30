import { updateProductsStocks } from "../api/products/product";
import { upsertValidatedOrder } from "../api/validatedOrders";
import { Product, ProductType } from "../types";

export type ProductsWithUpdatedStock = {
  productId: Product["id"];
  quantity: number;
  productTypeId: ProductType["id"];
  size: Product["size"];
  price: Product["price"];
};

export const updateStocksAfterValidatedOrder = async (
  command: any
): Promise<ProductsWithUpdatedStock[]> => {
  /**
   * On récupère les infos sur les produits vendus dans les métadonnées envoyées précédemments a stripe
   * On
   */
  const productsWithUpdatedStocks = Object.entries(command.metadata).map(
    ([productId, metadata]: [string, any]) => {
      const [productTypeId, quantityToRemove, size, price] =
        metadata.split("_");
      return {
        productId: Number(productId),
        quantityToRemove: Number(quantityToRemove),
        productTypeId: Number(productTypeId),
        size,
        price: Number(price),
      };
    }
  );

  await updateProductsStocks(productsWithUpdatedStocks);
  return productsWithUpdatedStocks.map((x) => ({
    price: x.price,
    productId: x.productId,
    productTypeId: x.productTypeId,
    quantity: x.quantityToRemove,
    size: x.size,
  }));
};

export const insertValidatedOrder = (
  command: any,
  productsWithUpdatedStocks: ProductsWithUpdatedStock[]
) => {
  try {
    upsertValidatedOrder({
      hasBeenSent: false,
      isArchived: false,
      orderContent: JSON.stringify(productsWithUpdatedStocks),
      shippingAddress: formatShippingAddress(command),
      stripeOrderId: command.id,
      stripePaymentUrl: `https://dashboard.stripe.com/test/payments/${command.payment_intent}`,
    });
  } catch (error) {
    console.error("err2", error);
  }
};

const formatShippingAddress = (command: any) => {
  const shippingInfos = command.shipping;
  const adressInfos = shippingInfos.address;
  return `${shippingInfos.name}, ${adressInfos.line1} ${
    adressInfos.line2 || ""
  } ${adressInfos.postal_code} ${adressInfos.city}`;
};
