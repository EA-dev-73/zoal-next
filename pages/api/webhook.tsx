// stripe a besoin du raw body et non un body parsé par nextjs

export const config = {
  api: {
    bodyParser: false,
  },
};

import { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import { updateProductsStocks } from "../../api/products/product";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const endpointSecret = process.env.STRIPE_WEBOOK_ENDPOINT_SECRET;

const handleCompletedSessionEvent = async (event: any) => {
  const command = await stripe.checkout.sessions.retrieve(event.data.object.id);

  const productsWithUpdatedStocks = Object.entries(command.metadata).map(
    ([productId, metadata]: [string, any]) => {
      const [productTypeId, quantityToRemove, size, price] =
        metadata.split("_");
      return {
        productId: Number(productId),
        quantityToRemove,
        productTypeId,
        size,
        price: Number(price),
      };
    }
  );

  await updateProductsStocks(productsWithUpdatedStocks);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    console.log("INSIDE");
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
    } catch (err: any) {
      console.log({ err });
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    if (event.type === "checkout.session.completed") {
      try {
        handleCompletedSessionEvent(event);
        res.status(200);
      } catch (error) {
        console.log(
          "Erreur lors de la mise a jour des stocks suite a une commande"
        );
      }
    }

    console.log(`Unhandled event type ${event.type}`);
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
