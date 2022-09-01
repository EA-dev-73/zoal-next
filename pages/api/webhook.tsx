import { buffer } from "micro";
import { NextApiRequest, NextApiResponse } from "next";
import { handleCompletedSessionEvent } from "../../api/helpers";

export const config = { api: { bodyParser: false } };

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  const signature = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBOOK_ENDPOINT_SECRET;
  // const endpointSecret =
  //   "whsec_366ce93aecf7ad0eadba9595f745d0d4f6d8cd19b351ced677ccb25044e68cf7";
  const reqBuffer = await buffer(req);

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      reqBuffer,
      signature,
      endpointSecret
    );
    // Handle the event
    if (event.type === "checkout.session.completed") {
      console.log("event checkout.session.completed received");
      handleCompletedSessionEvent(event);
      console.log("after event");
      res.status(200).end();
      return;
    }
  } catch (error: any) {
    console.log(error);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  res.send({ received: true });
};

export default handler;
