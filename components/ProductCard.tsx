import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ProductType as ProductType, Product } from "../types";

type Props = {
  productType: ProductType;
};

export const ProductCard = ({ productType }: Props) => {
  return (
    <div
      style={{ border: "1px dotted black", margin: "20px", padding: "10px" }}
    >
      <h2>{productType.name}</h2>
      {(productType?.productTypeImage || []).map((image) => (
        <Image
          key={image.id}
          src={image.imageUrl}
          alt={image.imageUrl}
          width={300}
          height={300}
        />
      ))}
      <div>
        <Link href={`/article/${productType.id}`} passHref>
          <a>Page produit</a>
        </Link>
      </div>
    </div>
  );
};
