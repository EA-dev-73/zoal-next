// stripe a besoin du raw body et non un body parsé par nextjs

export const config = {
  api: {
    bodyParser: false,
  },
};

import { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import {
  insertValidatedOrder,
  updateStocksAfterValidatedOrder,
} from "../../utils/webhookHelpers";
import { displayToast } from "../../utils/displayToast";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const endpointSecret = process.env.STRIPE_WEBOOK_ENDPOINT_SECRET;

const handleCompletedSessionEvent = async (event: any) => {
  try {
    const command = await stripe.checkout.sessions.retrieve(
      event.data.object.id
    );

    // 1 - update les stocks en bdd
    const productsWithUpdatedStocks = await updateStocksAfterValidatedOrder(
      command
    );

    // 2 - Insert des données de la validatedOrder en base
    insertValidatedOrder(command, productsWithUpdatedStocks);

    // l'update du localStorage sera ensuite faite coté client
  } catch (error) {
    console.error("err3", error);
    displayToast({
      type: "error",
      message: "Erreur lors de la commande",
    });
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
    } catch (err: any) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    if (event.type === "checkout.session.completed") {
      try {
        handleCompletedSessionEvent(event);
        res.send("");
      } catch (error) {
        console.error(
          "Erreur lors de la mise a jour des stocks suite a une commande"
        );
      }
    }

    console.error(`Unhandled event type ${event.type}`);
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
