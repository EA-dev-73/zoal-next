import { displayToast } from "../utils/displayToast";
import {
  insertValidatedOrder,
  updateStocksAfterValidatedOrder,
} from "../utils/webhookHelpers";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const handleCompletedSessionEvent = async (event: any) => {
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
