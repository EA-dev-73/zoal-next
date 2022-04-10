import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { ProductWithTypeAndQuantity } from "../types";
import { addQuantityToProducts } from "../utils/addItemsQuantityToProducts";
import { calculateTotalPrice } from "../utils/calculateTotalPrice";
import { useProductsForCart } from "../utils/cart";
import { groupProductsByType } from "../utils/groupProductsByType";
import {
  getCartContentFromLocalStorage,
  useRemoveItemFromCart,
} from "../utils/localStorageHelpers";
import { Price } from "../value-objects/Price";

type Props = {
  isRecap: boolean;
};

export const CartRecap = ({ isRecap }: Props) => {
  const { loadingProducts, products } = useProductsForCart();
  const removeItem = useRemoveItemFromCart();
  const router = useRouter();

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      alert(
        "Commande validée ! Vous allez recevoir un email de confirmation 😀"
      );
    }

    if (query.get("canceled")) {
      alert("Commande annulée");
    }
  }, []);

  if (loadingProducts) return <p>Chargement des produits...</p>;

  const isEmptyCart = !Object.values(groupProductsByType(products))?.length;
  const productsWithTypeAndQuantity = addQuantityToProducts(products || []);
  const totalPrice = calculateTotalPrice(productsWithTypeAndQuantity);

  const displayQuantity = (product: ProductWithTypeAndQuantity) => {
    if (product.stock < 1) {
      return <span style={{ color: "red" }}> | En Rupture de stock ⚠️ </span>;
    } else if (product.stock < product.quantity) {
      return (
        <span style={{ color: "red" }}>
          | Pas assez de stock ({product.stock}){" "}
        </span>
      );
    }
  };

  if (isEmptyCart && !isRecap)
    return (
      <p>
        Le panier est vide. Va{" "}
        <Link href={"/shop"}>acheter des trucs 🤑🤑</Link>
      </p>
    );

  const handleFinalizeCommand = async () => {
    try {
      const res = await fetch("/api/checkout_sessions", {
        method: "POST",
        body: JSON.stringify(getCartContentFromLocalStorage()),
      });
      const body = await res.json();
      router.replace(body.url);
    } catch (error: any) {
      console.error(error?.message || error);
    }
  };

  return (
    <>
      <ul>
        {Object.values(
          groupProductsByType<ProductWithTypeAndQuantity>(
            productsWithTypeAndQuantity
          )
        ).map((productTypes) => (
          <div key={productTypes[0].id}>
            <Link href={`/article/${productTypes[0].productType.id}`} passHref>
              <p className="lead" style={{ cursor: "pointer" }}>
                {productTypes[0].productType.name}
              </p>
            </Link>
            <ul>
              {productTypes.map((product) => (
                <div key={product.id}>
                  <span>
                    Taille : {product.size} | Prix à l&apos;unité :{" "}
                    {product.price}€ | Quantité : {product.quantity}{" "}
                    {displayQuantity(product)}
                  </span>

                  {!isRecap && (
                    <button
                      type="button"
                      className="btn btn-light my-3"
                      onClick={() => removeItem(product.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        className="align-baseline"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16 1.75V3h5.25a.75.75 0 010 1.5H2.75a.75.75 0 010-1.5H8V1.75C8 .784 8.784 0 9.75 0h4.5C15.216 0 16 .784 16 1.75zm-6.5 0a.25.25 0 01.25-.25h4.5a.25.25 0 01.25.25V3h-5V1.75z"
                        ></path>
                        <path d="M4.997 6.178a.75.75 0 10-1.493.144L4.916 20.92a1.75 1.75 0 001.742 1.58h10.684a1.75 1.75 0 001.742-1.581l1.413-14.597a.75.75 0 00-1.494-.144l-1.412 14.596a.25.25 0 01-.249.226H6.658a.25.25 0 01-.249-.226L4.997 6.178z"></path>
                        <path d="M9.206 7.501a.75.75 0 01.793.705l.5 8.5A.75.75 0 119 16.794l-.5-8.5a.75.75 0 01.705-.793zm6.293.793A.75.75 0 1014 8.206l-.5 8.5a.75.75 0 001.498.088l.5-8.5z"></path>
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </ul>
          </div>
        ))}
      </ul>
      <p className="display-6 mx-3">
        Total : {new Price(totalPrice).format()}{" "}
      </p>{" "}
      {!isRecap && (
        <button
          role="link"
          className="btn btn-outline-primary float-end mx-3"
          onClick={handleFinalizeCommand}
          //TODO disable si pas assez de stock
        >
          Passer la commande
        </button>
      )}
    </>
  );
};
