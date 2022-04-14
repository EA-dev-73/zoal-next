import { upsertValidatedOrder } from "../../api/validatedOrders";
import { ProductWithTypeAndCategory, ValidatedOrder } from "../../types";
import { StripeProduct } from "./AdminValidatedOrdersProductsMasterDetail";

export const onRowRemoving = (e: { data: ValidatedOrder }) => {
  const {
    hasBeenSent,
    orderContent,
    shippingAddress,
    stripeOrderId,
    stripePaymentUrl,
  } = e.data;
  upsertValidatedOrder({
    isArchived: true,
    hasBeenSent,
    orderContent,
    shippingAddress,
    stripeOrderId,
    stripePaymentUrl,
  });
};

export const onRowUpdating = (e: {
  newData: Partial<ValidatedOrder>;
  oldData: ValidatedOrder;
}) => {
  const newData = e.newData;
  const oldData = e.oldData;
  upsertValidatedOrder({
    isArchived: newData.isArchived || oldData.isArchived,
    hasBeenSent: newData.hasBeenSent || oldData.hasBeenSent,
    orderContent: oldData.orderContent,
    shippingAddress: newData.shippingAddress || oldData.shippingAddress,
    stripeOrderId: oldData.stripeOrderId,
    stripePaymentUrl: oldData.stripePaymentUrl,
  });
};

export const formatStripeProductsForMasterDetail = (
  stripeProducts: StripeProduct[],
  databaseProductTypes: ProductWithTypeAndCategory[] | null
) => {
  return stripeProducts.map((stripeProduct) => {
    //TODO pas ouf la double boucle. peut etre groupper..?
    const productType = (databaseProductTypes || []).find((x) =>
      x.products.some((y) => y.id === stripeProduct.productId)
    );
    return {
      ...stripeProduct,
      productName: productType?.name || "???",
      productCategory: productType?.productCategory.name || "???",
    };
  });
};
