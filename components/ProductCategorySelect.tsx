import { uniqBy } from "lodash";
import React from "react";
import { ProductType } from "../types";

type Props = {
  productTypes: ProductType[];
  onChange: (x: any) => void;
};

export const ProductCategorySelect = ({ productTypes, onChange }: Props) => {
  const uniqCategories = uniqBy(
    productTypes.map((x) => x.productCategory),
    "id"
  );
  return (
    <select onChange={(e) => onChange(Number(e.target.value))}>
      <option value={undefined} key="toutes_les_categories">
        Tous les produits
      </option>
      {(uniqCategories || []).map((category) => (
        <option value={category?.id} key={category?.id}>
          {category?.name}
        </option>
      ))}
    </select>
  );
};
