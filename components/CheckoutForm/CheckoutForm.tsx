import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { sendPayment } from "../../api/stripe";
import { LOCAL_STORAGE_CART_KEY } from "../../utils/localStorageHelpers";
import { BaseInput } from "./BaseInput";

type Props = {
  amount: number;
  receiptEmail: string;
  quantityError: boolean;
};

export const CheckoutForm = ({
  amount,
  receiptEmail,
  quantityError,
}: Props) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  // type FormData = {
  //   adress: string;
  //   city: string;
  //   firstname: string;
  //   lastname: string;
  //   postalCode: string;
  // };

  const onSubmit = async (data: any) => {
    if (!stripe || !elements) return;
    const card = elements.getElement(CardElement);
    if (!card) return;

    console.log({ card });
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
      receiptEmail: data.email,
      onSuccess: onPaymentSuccess,
      onError: onPaymentError,
    });
    paymentError && alert(paymentError);
  };
  //TODO meilleure verif des champs : ex code postal doit etre un numero ect...

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5">
        <h2 className="my-5">Adresse de livraison</h2>
      </div>
      <BaseInput
        register={register}
        field="firstname"
        label="Prénom"
        errors={errors}
      />
      <BaseInput
        register={register}
        field="lastname"
        label="Nom de famille"
        errors={errors}
      />
      <BaseInput
        register={register}
        field="email"
        label="Email"
        errors={errors}
        type="email"
      />
      <BaseInput register={register} field="adress" label="Adresse" />
      <BaseInput
        register={register}
        field="postalCode"
        label="Code postal"
        errors={errors}
        type="number"
      />
      <BaseInput
        register={register}
        field="city"
        label="Ville"
        errors={errors}
      />

      <div className="my-5">
        <h2 className="my-5">Informations de paiement</h2>
      </div>
      <CardElement />
      <div className="my-5">
        <button type="submit" disabled={!stripe || !elements || quantityError}>
          Commander
        </button>
      </div>
    </form>
  );
};
