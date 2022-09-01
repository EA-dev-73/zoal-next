// stripe a besoin du raw body et non un body parsé par nextjs

export const config = {
  api: {
    bodyParser: false,
  },
};

import { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import { handleCompletedSessionEvent } from "../../api/helpers";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const endpointSecret = process.env.STRIPE_WEBOOK_ENDPOINT_SECRET;

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
