import { Layout } from "../components/Layout";
import { Category, Product } from "../types";
import { supabase } from "../utils/supabaseClient";

type Props = {
  products: Product[];
  categories: Category[];
};

export default function Shop({ products }: Props) {
  return (
    <Layout pageTitle="Shop" isShop>
      <p>Nombre de produits : {products.length}</p>
      <div>
        {products.map((product) => (
          <p key={product.id}>{product.name}</p>
        ))}
      </div>
    </Layout>
  );
}

export const getServerSideProps = async () => {
  const { data: products } = await supabase.from("product").select(`
      id, name,
      productCategory (id, name)
  `);

  return { props: { products } };
};
