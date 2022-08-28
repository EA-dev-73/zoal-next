import { orderBy } from "lodash";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!router.query) {
      setFilter(null);
      return;
    }
    const catToFilter = (categories || []).find(
      (x) =>
        x.name?.toLowerCase() === Object.keys(router.query)[0]?.toLowerCase()
    );

    if (!catToFilter) {
      setFilter(null);
      return;
    }

    setFilter(catToFilter.id);
  }, [router.query, categories, router]);

  return (
    <Layout>
      <div className="d-flex flex-wrap justify-content-between mx-5">
        {isLoading ? (
          <p>chargement des produits... </p>
        ) : (
          orderBy(productTypesWithImages || [], "createdAt", "desc")
            .filter((productType) =>
              filter ? productType.productCategory.id === filter : true
            )

            .map((productType) => (
              <ProductCard key={productType.id} productType={productType} />
            ))
        )}
      </div>
    </Layout>
  );
}
