import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ProductType as ProductType, Product } from "../types";
import { ImageCarousel } from "./ImageCarousel";

type Props = {
  productType: ProductType;
};

export const ProductCard = ({ productType }: Props) => {
  return (
    <div
      style={{ border: "1px dotted black", margin: "20px", padding: "10px" }}
    >
      <h2>{productType.name}</h2>
      <ImageCarousel images={productType.productTypeImage} />
      <div>
        <Link href={`/article/${productType.id}`} passHref>
          <a>Page produit</a>
        </Link>
      </div>
    </div>
  );
};
