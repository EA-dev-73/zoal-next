import { orderBy } from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCategories } from "../api/category";
import { fetchProductTypesWithImages } from "../api/products/product-type";
import { Layout } from "../components/Layout";
import { ProductCard } from "../components/ProductCard";
import { Category, ProductTypeWithImages } from "../types";

type Props = {
  productTypes: ProductTypeWithImages[];
};

export default function Shop({ productTypes }: Props) {
  const router = useRouter();
  const [filter, setFilter] = useState<Category["id"] | null>(null);
  const { categories } = useCategories();

  useEffect(() => {
    if (!router.query) return;
    console.log(router);
    console.log(categories);
    const catToFilter = (categories || []).find(
      (x) =>
        x.name?.toLowerCase() === Object.keys(router.query)[0]?.toLowerCase()
    );

    if (!catToFilter) return;

    setFilter(catToFilter.id);
  }, [router.query, categories, router]);

  return (
    <Layout>
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

export const getStaticProps = async () => {
  const productTypes = await fetchProductTypesWithImages();
  return { props: { productTypes } };
};
