import type { NextPage } from "next";
import { useEffect } from "react";
import { Layout } from "../components/Layout";
import { clearLocalStorageCart } from "../utils/localStorageHelpers";

const Home: NextPage = () => {
  /**
   * Une fois une commande validée ou annulée, on affiche un message à l'utilisateur + vide le panier du localStorage si commande validée
   */
  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      clearLocalStorageCart();
      alert(
        "Commande validée ! Vous allez recevoir un email de confirmation 😀"
      );
    }

    if (query.get("canceled")) {
      alert("Commande annulée");
    }
  }, []);

  return (
    <Layout>
      <h1>Présentation</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab, tempore
        enim? Temporibus, dicta reprehenderit ipsam, vitae ab perferendis nihil
        saepe libero aliquid qui autem corporis cupiditate reiciendis corrupti
        voluptatem totam!
      </p>
    </Layout>
  );
};

export default Home;
