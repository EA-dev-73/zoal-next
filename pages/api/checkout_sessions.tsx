import { NextApiRequest, NextApiResponse } from "next";
import { Product } from "../../types";
import { generateStripePriceData } from "./lib";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const cartContent: Product["id"][] = JSON.parse(req.body);
    try {
      if (!cartContent?.length) {
        res.status(500).json("Le panier est vide");
      }

      const session = await stripe.checkout.sessions.create({
        line_items: await generateStripePriceData(cartContent),
        mode: "payment",
        success_url: `${req.headers.origin}/panier?success=true`,
        cancel_url: `${req.headers.origin}/panier?canceled=true`,
        locale: "fr",
        shipping_address_collection: {
          allowed_countries: ["FR"],
        },
      });
      res.json({ url: session.url });
    } catch (err: any) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
