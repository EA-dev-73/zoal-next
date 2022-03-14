import { getProducts } from "../api/products-api";
import { Layout } from "../components/Layout";
import { ProductCard } from "../components/ProductCard";
import { Product as ProductType } from "../types";

type Props = {
  products: ProductType[];
};

export default function Shop({ products }: Props) {
  return (
    <Layout pageTitle="Shop" isShop>
      <div>
        {(products || []).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </Layout>
  );
}

export const getServerSideProps = async () => {
  const products = await getProducts();
  return { props: { products } };
};
