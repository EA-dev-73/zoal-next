import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CheckoutForm } from "../components/CheckoutForm/CheckoutForm";
import { CartRecap } from "../components/CartRecap";
import { useCalculateCartTotalPrice } from "../utils/useTotalPrice";

function FinaliserCommande() {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  );
  const { loadingProducts, totalPrice, quantityError } =
    useCalculateCartTotalPrice();

  if (loadingProducts) return <p>Chargement des produits...</p>;

  return (
    <div>
      <Elements stripe={stripePromise}>
        <CheckoutForm
          amount={totalPrice}
          receiptEmail={"tommymartin1234@gmail.com"}
          quantityError={quantityError}
        />
      </Elements>
      <h1>Récapitulatif de la commande</h1>
      <CartRecap isRecap />
    </div>
  );
}

export default FinaliserCommande;
