import { displayToast } from "../utils/displayToast";
import {
  insertValidatedOrder,
  updateStocksAfterValidatedOrder,
} from "../utils/webhookHelpers";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const handleCompletedSessionEvent = async (event: any) => {
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
