import React from "react";
import { Product as ProductType } from "../types";

type Props = {
  product: ProductType;
};

export const Product = ({ product }: Props) => {
  return <div>{product.name}</div>;
};
