import { useState } from "react";
import { fetchProductTypes } from "../api/products-api";
import { ProductCard } from "../components/ProductCard";
import { ProductCategorySelect } from "../components/ProductCategorySelect";
import { Category, ProductType as ProductType } from "../types";

type Props = {
  productTypes: ProductType[];
};

export default function Shop({ productTypes }: Props) {
  const [filter, setFilter] = useState<Category["id"] | null>(null);
  return (
    <>
      <ProductCategorySelect productTypes={productTypes} onChange={setFilter} />
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {(productTypes || [])
          .filter((productType) =>
            filter ? productType.productCategory.id === filter : true
          )
          .map((productType) => (
            <ProductCard key={productType.id} productType={productType} />
          ))}
      </div>
    </>
  );
}

export const getServerSideProps = async () => {
  const productTypes = await fetchProductTypes();
  return { props: { productTypes } };
};
