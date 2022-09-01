import { ValidatedOrder } from "../types";
import { handlePostgresError } from "../utils/handleError";
import { supabase } from "../utils/supabaseClient";
import { TableConstants } from "../utils/TableConstants";

export const getValidatedOrders = async () => {
  const { data, error } = await supabase
    .from<ValidatedOrder>(TableConstants.validatedOrder)
    .select();
  return {
    data,
    error,
  };
};

type UpsertValidatedOrderDTO = Omit<ValidatedOrder, "id" | "created_at">;

export const upsertValidatedOrder = async (
  upsertValidatedOrderData: UpsertValidatedOrderDTO
) => {
  console.log("before upsertValidatedOrder");
  const { error } = await supabase.from(TableConstants.validatedOrder).upsert(
    {
      stripeOrderId: upsertValidatedOrderData.stripeOrderId,
      orderContent: upsertValidatedOrderData.orderContent,
      hasBeenSent: upsertValidatedOrderData.hasBeenSent,
      stripePaymentUrl: upsertValidatedOrderData.stripePaymentUrl,
      shippingAddress: upsertValidatedOrderData.shippingAddress,
      isArchived: upsertValidatedOrderData.isArchived,
    },
    {
      onConflict: "stripeOrderId",
    }
  );
  console.log("after upsertValidatedOrder", error);
  error && handlePostgresError(error);
};
