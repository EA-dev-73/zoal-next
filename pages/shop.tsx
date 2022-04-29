import { orderBy } from "lodash";
import { GetServerSideProps } from "next";
import { useState } from "react";
import { fetchProductTypesWithImages } from "../api/products/product-type";
import { Layout } from "../components/Layout";
import { ProductCard } from "../components/ProductCard";
import { ProductCategorySelect } from "../components/ProductCategorySelect";
import { Category, ProductTypeWithImages } from "../types";

type Props = {
  productTypes: ProductTypeWithImages[];
};

export default function Shop({ productTypes }: Props) {
  const [filter, setFilter] = useState<Category["id"] | null>(null);
  return (
    <Layout>
      <ProductCategorySelect productTypes={productTypes} onChange={setFilter} />
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
          margin: "50px",
        }}
      >
        {orderBy(productTypes || [], "createdAt", "desc")
          .filter((productType) =>
            filter ? productType.productCategory.id === filter : true
          )

          .map((productType) => (
            <ProductCard key={productType.id} productType={productType} />
          ))}
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const queryParams = Object.keys(context.query);
  const productTypes = await fetchProductTypesWithImages();

  if (!queryParams?.length) {
    return { props: { productTypes } };
  }

  const filteredProducts = productTypes.filter((x) =>
    queryParams
      .map((x) => x.toLowerCase())
      .includes(x.productCategory?.name?.toLowerCase())
  );

  return { props: { productTypes: filteredProducts } };
};
