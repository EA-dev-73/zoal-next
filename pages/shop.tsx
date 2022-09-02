import { orderBy } from "lodash";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useCategories } from "../api/category";
import { useProductTypesWithImages } from "../api/products/product-type";
import { Layout } from "../components/Layout";
import { ProductCard } from "../components/ProductCard";
import { Category } from "../types";

export default function Shop() {
  const router = useRouter();
  const [filter, setFilter] = useState<Category["id"] | null>(null);
  const { data: categories } = useCategories();

  const { productTypesWithImages, isLoading } = useProductTypesWithImages();

  const categoryToFilter = useMemo(
    () =>
      (categories || []).find(
        (x) =>
          x.name?.toLowerCase() === Object.keys(router.query)[0]?.toLowerCase()
      ),
    [categories, router.query]
  );

  useEffect(() => {
    if (!router.query) {
      setFilter(null);
      return;
    }

    if (!categoryToFilter) {
      setFilter(null);
      return;
    }

    setFilter(categoryToFilter.id);
  }, [categoryToFilter, router.query]);

  return (
    <Layout>
      {categoryToFilter ? <h2>{categoryToFilter.name}</h2> : ""}
      <div className="d-flex flex-wrap justify-content-between mx-5">
        {isLoading ? (
          <p>chargement des produits... </p>
        ) : (
          <>
            {orderBy(productTypesWithImages || [], "createdAt", "desc")
              .filter((productType) =>
                filter ? productType.productCategory.id === filter : true
              )

              .map((productType) => (
                <ProductCard key={productType.id} productType={productType} />
              ))}
          </>
        )}
      </div>
    </Layout>
  );
}
