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

      type CheckoutMetadata = Record<string, string | number>;

      /**
       * On génère des metadata du type {productId : productTypeId_quantity_size_price} pour pouvoir plus facilement mettre a jour les stocks une fois la commande validée
       * Ca aurait été beaucoup mieux de JSON.stringify un .map mais stripe n'accepte que le format object {} :(
       */
      const generateMetadata = () => {
        const obj: CheckoutMetadata = {};
        const prod = products || [];
        for (let i = 0; i < prod.length; i++) {
          obj[`${prod[i].id}`] = `${prod[i].productTypeId}_${
            productOccurences[prod[i].id]
          }_${prod[i].size}_${prod[i].price}`;
        }
        return obj;
      };

      const session = await stripe.checkout.sessions.create({
        shipping_options: shippingOptions,
        line_items: productsFormattedForStripe,
        mode: "payment",
        success_url: `${req.headers.origin}?success=true`,
        cancel_url: `${req.headers.origin}?canceled=true`,
        locale: "fr",
        shipping_address_collection: {
          allowed_countries: ["FR"],
        },
        metadata: generateMetadata(),
        receipt_email: "tommymartin1234@gmail.com",
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
