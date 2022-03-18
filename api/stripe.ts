import { Stripe, StripeCardElement } from "@stripe/stripe-js";

type CreateStripePaymentMethodParams = {
  stripe: Stripe;
  card: StripeCardElement;
  amount: number;
  receiptEmail: string;
  onSuccess: () => void;
  onError: () => void;
};

export const sendPayment = async ({
  stripe,
  card,
  amount,
  receiptEmail,
  onSuccess,
  onError,
}: CreateStripePaymentMethodParams) => {
  const { paymentMethod, error } = await stripe.createPaymentMethod({
    type: "card",
    card,
  });
  error && alert("Error while creating a payment method");
  try {
    const res = await fetch("/api/pay", {
      method: "POST",
      body: JSON.stringify({ paymentMethod, amount, receiptEmail }),
    });
    res.ok ? onSuccess() : onError();
  } catch (error) {
    return error;
  }
};
