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
    console.log("inside handleCompletedSessionEvent");
    const command = await stripe.checkout.sessions.retrieve(
      event.data.object.id
    );

    console.log({ command });

    // 1 - update les stocks en bdd
    const productsWithUpdatedStocks = await updateStocksAfterValidatedOrder(
      command
    );

    console.log({ productsWithUpdatedStocks });

    console.log("before insertValidatedOrder");

    // 2 - Insert des données de la validatedOrder en base
    insertValidatedOrder(command, productsWithUpdatedStocks);

    console.log("after insertValidatedOrder");

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
  try {
    if (req.method === "POST") {
      const buf = await buffer(req);
      const sig = req.headers["stripe-signature"];

      let event;

      event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);

      // Handle the event
      if (event.type === "checkout.session.completed") {
        console.log("inside checkout.session.completed event");
        handleCompletedSessionEvent(event);
        res.status(200).end();
        return;
      }

      console.error(`Unhandled event type ${event.type}`);
    } else {
      res.setHeader("Allow", "POST");
      res.status(405).end("Method Not Allowed");
    }
  } catch (error) {
    res.status(500).end;
    console.error("err5", error);
    throw error;
  }
}
