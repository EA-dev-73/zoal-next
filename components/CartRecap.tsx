import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { ProductWithTypeAndQuantity } from "../types";
import { addQuantityToProducts } from "../utils/addItemsQuantityToProducts";
import { calculateTotalPrice } from "../utils/calculateTotalPrice";
import { useProductsForCart } from "../utils/cart";
import { groupProductsByType } from "../utils/groupProductsByType";
import { useRemoveItemFromCart } from "../utils/localStorageHelpers";
import { Price } from "../value-objects/Price";

type Props = {
  isRecap: boolean;
};

export const CartRecap = ({ isRecap }: Props) => {
  const { loadingProducts, products } = useProductsForCart();
  const removeItem = useRemoveItemFromCart();
  const router = useRouter();
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
              <p>{productTypes[0].productType.name}</p>
            </Link>
            <ul>
              {productTypes.map((product) => (
                <li key={product.id}>
                  Taille : {product.size} | Prix à l&apos;unité :{" "}
                  {product.price}€ | Quantité : {product.quantity}{" "}
                  {displayQuantity(product)}
                  {!isRecap && (
                    <button
                      style={{ marginLeft: "10px" }}
                      onClick={() => removeItem(product.id)}
                    >
                      Supprimer 1 article du panier
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </ul>
      <p>Total : {new Price(totalPrice).format()} </p>{" "}
      {!isRecap && (
        <button onClick={() => router.replace("/finaliser-commande")}>
          Passer la commande
        </button>
      )}
    </>
  );
};
