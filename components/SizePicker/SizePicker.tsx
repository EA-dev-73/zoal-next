import React from "react";
import { Product, ProductType } from "../../types";
import { displaySize, getStock } from "./lib";

type Props = {
  sizes: Product["size"][];
  selectedSize?: Product["size"] | null;
  onClick: (size: string) => void;
  productType: ProductType;
};

export const SizePicker = ({
  sizes,
  onClick,
  selectedSize,
  productType,
}: Props) => {
  return (
    <div className="dropdown">
      <button
        className="btn btn-secondary dropdown-toggle"
        type="button"
        id="dropdownMenuButton1"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {selectedSize || sizes[0]}
      </button>
      <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
        {sizes.map((size) => {
          const stockForSize = getStock(productType, size);
          return (
            <li key={size} onClick={() => onClick(size)}>
              <a
                className={`dropdown-item ${stockForSize <= 0 && "disabled"}`}
                href="#"
              >
                {displaySize(size, stockForSize)}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
