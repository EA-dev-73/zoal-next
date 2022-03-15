import { fetchProductTypes } from "../api/products-api";
import { Layout } from "../components/Layout";
import { ProductCard } from "../components/ProductCard";
import { ProductType as ProductType } from "../types";

type Props = {
  productTypes: ProductType[];
};

export default function Shop({ productTypes }: Props) {
  return (
    <Layout pageTitle="Shop">
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {(productTypes || []).map((productType) => (
          <ProductCard key={productType.id} productType={productType} />
        ))}
      </div>
    </Layout>
  );
}

export const getServerSideProps = async () => {
  const productTypes = await fetchProductTypes();
  return { props: { productTypes } };
};
