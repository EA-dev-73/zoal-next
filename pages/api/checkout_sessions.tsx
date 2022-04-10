import { countBy } from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import { fetchProductsFromIds } from "../../api/products/product";
import { Product } from "../../types";
import { generateStripePriceData, generateStripeShippingFees } from "./lib";

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

      const products = await fetchProductsFromIds(cartContent);
      const productOccurences = countBy(cartContent);

      const shippingOptions = generateStripeShippingFees(products);
      const productsFormattedForStripe = generateStripePriceData(
        products,
        productOccurences
      );

      const session = await stripe.checkout.sessions.create({
        shipping_options: shippingOptions,
        line_items: productsFormattedForStripe,
        mode: "payment",
        success_url: `${req.headers.origin}/panier?success=true`,
        cancel_url: `${req.headers.origin}/panier?canceled=true`,
        locale: "fr",
        shipping_address_collection: {
          allowed_countries: ["FR"],
        },
      });

      //TODO update les stock qu'une fois la commande effectuée
      // await updateProductsStocks(
      //   (products || []).map((product) => ({
      //     productId: product.id,
      //     quantityToRemove: productOccurences[product.id],
      //     productTypeId: product.productTypeId,
      //     size: product.size,
      //     price: product.price,
      //   }))
      // );
      res.json({ url: session.url });
    } catch (err: any) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
