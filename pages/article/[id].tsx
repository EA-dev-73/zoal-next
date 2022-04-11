import { NextPageContext } from "next";
import { fetchProductTypeById } from "../../api/products/product-type";
import { Layout } from "../../components/Layout";
import { ProductType } from "../../types";
import { useAddProductIdToCart } from "../../utils/localStorageHelpers";

type Props = {
  productType: ProductType;
};

const ProductPage = ({ productType }: Props) => {
  const addProductToCart = useAddProductIdToCart();

  const displayDisponibilities = () => {
    if (!productType?.products?.length)
      return <p>Produit victime de son succès... pour le moment 🤔</p>;
    return (
      <ul>
        {productType.products.map((product) => {
          return (
            <li key={product.id}>
              Taille : {product.size} | Prix : {product.price + "€"} | En stock
              : {product.stock > 0 ? product.stock : "❌"}
              {product.stock && (
                <button onClick={() => addProductToCart(product.id)}>
                  Ajouter au panier
                </button>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <Layout>
      <p>Disponibilités :{displayDisponibilities()}</p>
    </Layout>
  );
};
export default ProductPage;

export const getServerSideProps = async (context: NextPageContext) => {
  const productType = await fetchProductTypeById(Number(context.query.id));
  return { props: { productType } };
};
