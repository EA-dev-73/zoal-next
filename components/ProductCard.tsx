import React from "react";
import { Product as ProductType, ProductItem } from "../types";
import { addItemToCard } from "../utils/localStorageHelpers";

type Props = {
  product: ProductType;
};

export const ProductCard = ({ product }: Props) => {
  const handleAddProductToCard = (item: ProductItem) => {
    addItemToCard(item);
  };
  return (
    <div style={{ border: "2px solid black" }}>
      <p>Nom : {product.name}</p>
      <p>Categorie : {product.productCategory.name}</p>
      <p>Créé le : {new Date(product.createdAt).toUTCString()}</p>
      <p>
        Disponibilités :
        <ul>
          {product.productItems.map((item) => {
            return (
              <li key={item.id}>
                Taille : {item.size} | Prix : {item.price + "€"} | En stock :{" "}
                {item.inStock ? "✅" : "❌"}
                {item.inStock && (
                  <button onClick={() => handleAddProductToCard(item)}>
                    Ajouter au panier
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </p>
    </div>
  );
};
