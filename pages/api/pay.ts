import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing secret STRIPE_SECRET_KEY");
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { paymentMethod, receiptEmail, amount } = JSON.parse(req.body);

  if (!paymentMethod) {
    return res.status(403).json("Payment method is missing");
  }

  if (!amount) {
    return res.status(403).json("Amount is missing");
  }

  if (!receiptEmail) {
    return res.status(403).json("Receipt email is missing");
  }

  try {
    await stripe.paymentIntents.create({
      amount: amount * 100, // en centimes
      currency: "eur",
      //TODO description de la commande (date - produits et quantités)
      description:
        "Premiers pas vers la richesse d'Amélie avec la payment intent API",
      receipt_email: receiptEmail,
      payment_method_types: ["card"],
      payment_method: paymentMethod.id,
      confirm: true,
    });
    res.status(200).json("✅");
  } catch (error) {
    return res.status(500).json(error);
  }
}
