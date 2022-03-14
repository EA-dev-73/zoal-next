import Link from "next/link";
import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { CartItem } from "../types";
import {
  getCartContentFromLocalStorage,
  removeItemFromCart,
} from "../utils/localStorageHelpers";
import { Price } from "../value-objects/Price";

export default function Panier() {
  const [cartContent, setCartContent] = useState<CartItem[]>([]);
  const handleRemoveItemFromCart = (item: CartItem) => {
    const newCartContent = removeItemFromCart(item);
    setCartContent(newCartContent);
  };

  useEffect(() => {
    const localStorageContent = getCartContentFromLocalStorage();
    setCartContent(localStorageContent);
  }, []);

  const calculateTotalPrice = (cartContent: CartItem[]) => {
    return cartContent.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  };

  return (
    <Layout pageTitle="Panier">
      <h1>Contenu du panier</h1>
      {cartContent.length ? (
        <>
          {" "}
          <ul>
            {(cartContent || []).map((item) => {
              return (
                <li key={item.id}>
                  {item.name} | Taille : {item.size} | Prix : {item.price} |
                  Quantité : {item.quantity}
                  <button onClick={() => handleRemoveItemFromCart(item)}>
                    Supprimer du panier
                  </button>
                </li>
              );
            })}
          </ul>
          <p>Total : {new Price(calculateTotalPrice(cartContent)).format()} </p>{" "}
        </>
      ) : (
        <p>
          Le panier est vide. Va{" "}
          <Link href={"shop"}>acheter des trucs 🤑🤑</Link>
        </p>
      )}
    </Layout>
  );
}
