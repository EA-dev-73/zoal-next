import React from "react";
import { Product as ProductType } from "../types";

type Props = {
  product: ProductType;
};

export const ProductCard = ({ product }: Props) => {
  return (
    <div style={{ border: "2px solid black" }}>
      <p>Nom : {product.name}</p>
      <p>Categorie : {product.productCategory.name}</p>
      <p>Créé le : {new Date(product.createdAt).toUTCString()}</p>
      <p>
        Disponibilités :
        <ul>
          {product.productItem.map((item) => {
            return (
              <li key={item.id}>
                Taille : {item.size} | Prix : {item.price + "€"} | En stock :{" "}
                {item.inStock ? "✅" : "❌"}
              </li>
            );
          })}
        </ul>
      </p>
    </div>
  );
};
