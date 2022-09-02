import React from "react";
import { isMobile } from "react-device-detect";
import styles from "../styles/ArticlePage.module.css";
import { ProductType } from "../types";

type Props = {
  productType: ProductType;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  availableSizes: JSX.Element[];
  maxQuantityForSize: number | undefined;
  selectedQuantity: number;
  setSelectedQuantity: (quantity: number) => void;
  handleAdd: () => void;
};

export const ArticleIdForm = ({
  productType,
  selectedSize,
  setSelectedSize,
  availableSizes,
  maxQuantityForSize,
  selectedQuantity,
  setSelectedQuantity,
  handleAdd,
}: Props) => {
  return (
    <div className={isMobile ? "" : styles["stick-to-bottom"]}>
      {!isMobile ? (
        <h2 className={styles["product-name"]}>{productType.name}</h2>
      ) : null}

      <label htmlFor="select-size" className="mb-0">
        Taille
      </label>
      <select
        className="form-select"
        aria-label="Sélection de la taille souhaitée"
        id="select-size"
        value={selectedSize ? selectedSize : ""}
        onChange={(e) => setSelectedSize(e.target.value)}
      >
        {availableSizes}
      </select>
      <label htmlFor="select-size" className="mb-0">
        Quantité
      </label>
      <input
        id="select-quantity"
        type="number"
        className="form-control"
        placeholder="Quantité"
        aria-label="Sélection de la quantité souhaitée"
        aria-describedby="Sélection de la quantité souhaitée"
        min={1}
        max={maxQuantityForSize}
        value={selectedQuantity}
        onChange={(e) => setSelectedQuantity(Number(e.target.value))}
      />

      <button
        role="button"
        className="btn btn-outline-success mt-3 mb-4"
        onClick={handleAdd}
      >
        Ajouter au panier
      </button>
    </div>
  );
};
