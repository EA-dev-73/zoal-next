import Stripe from "stripe";
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing secret STRIPE_SECRET_KEY");
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});

export default async function handler(req, res) {
  try {
    //todo use payment intents api https://stripe.com/docs/payments/payment-intents/migration/charges
    // https://stripe.com/docs/payments/payment-intents
    const stripeRes = await stripe.paymentIntents.create({
      amount: 600,
      currency: "eur",
      description: "Premiers pas vers la richesse d'Amélie",
      receipt_email: "tommymartin1234@gmail.com",
      payment_method_types: ["card"],
    });
    console.log({ stripeRes });
    res.status(200).json();
  } catch (error) {
    res.status(500).json();
    console.log(1, error);
  }
}
