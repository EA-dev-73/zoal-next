import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useRouter } from "next/router";
import { sendPayment } from "../api/stripe";
import { LOCAL_STORAGE_CART_KEY } from "../utils/localStorageHelpers";

type Props = {
  amount: number;
  receiptEmail: string;
};

export const CheckoutForm = ({ amount, receiptEmail }: Props) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (!stripe || !elements) return;
    const card = elements.getElement(CardElement);

    if (!card) return;

    const onPaymentSuccess = () => {
      alert("Payment validé 👍");
      localStorage.removeItem(LOCAL_STORAGE_CART_KEY);
      router.reload();
    };
    const onPaymentError = () => {
      alert("Payment non validé 👎");
    };

    const paymentError = await sendPayment({
      stripe,
      card,
      amount,
      receiptEmail,
      onSuccess: onPaymentSuccess,
      onError: onPaymentError,
    });
    paymentError && alert(paymentError);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe || !elements}>
        Payer
      </button>
    </form>
  );
};
