import Image from "next/image";
import React from "react";
import { ProductType as ProductType, Product } from "../types";
import { addProductIdToCart as addproductToCart } from "../utils/localStorageHelpers";

type Props = {
  productType: ProductType;
};

//TODO display images

export const ProductCard = ({ productType }: Props) => {
  return (
    <div
      style={{ border: "1px dotted black", margin: "20px", padding: "10px" }}
    >
      {/* {productType.imageUrl && (
        <Image
          src={productType.imageUrl}
          alt={`Image du produit ${productType.name}`}
          width={300}
          height={300}
        />
      )} */}

      <p>Nom : {productType.name}</p>
      <p>Categorie : {productType.productCategory.name}</p>
      <p>
        Disponibilités :
        <ul>
          {productType.products.map((product) => {
            return (
              <li key={product.id}>
                Taille : {product.size} | Prix : {product.price + "€"} | En
                stock : {product.stock > 0 ? product.stock : "❌"}
                {product.stock && (
                  <button onClick={() => addproductToCart(product.id)}>
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
