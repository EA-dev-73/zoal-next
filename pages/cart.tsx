import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { CartItem } from "../types";
import {
  getCartContentFromLocalStorage,
  removeItemFromCart,
} from "../utils/localStorageHelpers";

export default function Shop() {
  const [cartContent, setCartContent] = useState<CartItem[]>([]);
  const handleRemoveItemFromCart = (item: CartItem) => {
    const newCartContent = removeItemFromCart(item.id, item.createdAt);
    console.log(1, newCartContent.length);
    setCartContent(newCartContent);
  };

  useEffect(() => {
    const localStorageContent = getCartContentFromLocalStorage();
    setCartContent(localStorageContent);
  }, []);

  //TODO
  // affichage propre des prix
  // gestion si pas de produits
  return (
    <Layout pageTitle="Panier">
      <h1>Contenu du panier</h1>
      <ul>
        {(cartContent || []).map((item) => {
          return (
            <li key={new Date(item.createdAt).toISOString()}>
              {item.name} | Taille : {item.size} | Prix : {item.price}
              <button onClick={() => handleRemoveItemFromCart(item)}>
                Supprimer du panier
              </button>
            </li>
          );
        })}
      </ul>
      Total : {cartContent?.reduce((acc, item) => acc + item.price, 0) + "€"}
    </Layout>
  );
}
