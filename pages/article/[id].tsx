import { NextPageContext } from "next";
import { fetchProductTypeById } from "../../api/products/product-type";
import { ProductType } from "../../types";
import { useAddProductIdToCart } from "../../utils/localStorageHelpers";

type Props = {
  productType: ProductType;
};

const ProductPage = ({ productType }: Props) => {
  const addProductToCart = useAddProductIdToCart();

  return (
    <div>
      <p>
        Disponibilités :
        <ul>
          {productType.products.map((product) => {
            return (
              <li key={product.id}>
                Taille : {product.size} | Prix : {product.price + "€"} | En
                stock : {product.stock > 0 ? product.stock : "❌"}
                {product.stock && (
                  <button onClick={() => addProductToCart(product.id)}>
                    Ajouter au panier
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </p>
    </div>
  );
};
export default ProductPage;

export const getServerSideProps = async (context: NextPageContext) => {
  const productType = await fetchProductTypeById(Number(context.query.id));
  return { props: { productType } };
};
