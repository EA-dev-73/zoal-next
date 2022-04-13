import { upsertValidatedOrder } from "../../api/validatedOrders";
import { ValidatedOrder } from "../../types";

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
