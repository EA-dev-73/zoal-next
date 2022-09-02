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

export const upsertValidatedOrder = async ({
  hasBeenSent,
  isArchived,
  orderContent,
  shippingAddress,
  stripeOrderId,
  stripePaymentUrl,
}: UpsertValidatedOrderDTO) => {
  const { error } = await supabase.from(TableConstants.validatedOrder).upsert(
    {
      stripeOrderId,
      orderContent,
      hasBeenSent,
      stripePaymentUrl,
      shippingAddress,
      isArchived,
    },
    {
      onConflict: "stripeOrderId",
    }
  );
  error && handlePostgresError(error);
};
