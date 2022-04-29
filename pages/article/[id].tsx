import { NextPageContext } from "next";
import { fetchProductTypeByIdWithImages } from "../../api/products/product-type";
import { Layout } from "../../components/Layout";
import { ProductTypeWithImages } from "../../types";
import { useAddProductIdToCart } from "../../utils/localStorageHelpers";
import Image from "next/image";

type Props = {
  productTypeWithImages: ProductTypeWithImages;
};

const ProductPage = ({ productTypeWithImages }: Props) => {
  const addProductToCart = useAddProductIdToCart();

  const displayDisponibilities = () => {
    if (!productTypeWithImages?.products?.length)
      return <p>Produit victime de son succès... pour le moment 🤔</p>;
    return (
      <ul>
        {productTypeWithImages.products.map((product) => {
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
      <div
        style={{
          display: "flex",
        }}
      >
        {(productTypeWithImages.imagesUrls || []).map((image) => (
          <Image
            src={image}
            key={image}
            alt="image produit"
            width={500}
            height={700}
          />
        ))}

        <p>Disponibilités :{displayDisponibilities()}</p>
      </div>
    </Layout>
  );
};
export default ProductPage;

export const getServerSideProps = async (context: NextPageContext) => {
  const productTypeWithImages = await fetchProductTypeByIdWithImages(
    Number(context.query.id)
  );
  return { props: { productTypeWithImages } };
};
