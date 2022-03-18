import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fetchProductsFromIds } from "../api/products-api";
import { Layout } from "../components/Layout";
import { CheckoutForm } from "../components/StripeCheckoutForm";
import {
  Product,
  ProductWithTypeAndQuantity,
  ProductWithTypeData,
} from "../types";
import { addQuantityToProducts } from "../utils/addItemsQuantityToProducts";
import { groupProductsByType } from "../utils/groupProductsByType";
import {
  getCartContentFromLocalStorage,
  removeItemFromCart,
} from "../utils/localStorageHelpers";
import { Price } from "../value-objects/Price";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function Panier() {
  const router = useRouter();
  const [products, setProducts] = useState([] as ProductWithTypeData[]);

  useEffect(() => {
    const localStorageContent = getCartContentFromLocalStorage();
    fetchProductsFromIds(localStorageContent).then((products) => {
      setProducts(products || []);
    });
  }, []);

  const handleRemoveItemFromCart = (product: Product) => {
    removeItemFromCart(product.id, product.inStock);
    router.reload();
  };

  const calculateTotalPrice = (
    productsWithQuantity: ProductWithTypeAndQuantity[]
  ) =>
    productsWithQuantity.reduce((acc, item) => {
      if (item.inStock) return acc + item.price * item.quantity;
      return acc;
    }, 0);

  const isEmptyCart = !Object.values(groupProductsByType(products))?.length;

  const productsWithTypeAndQuantity = addQuantityToProducts(products || []);

  const displayQuantity = (product: ProductWithTypeAndQuantity) => {
    if (product.inStock) {
      return ` ${product.quantity} `;
    } else {
      return <span style={{ color: "red" }}> En Rupture de stock ⚠️ </span>;
    }
  };

  const totalPrice = calculateTotalPrice(productsWithTypeAndQuantity);

  return (
    <Layout pageTitle="Panier">
      <h1>Contenu du panier</h1>
      {!isEmptyCart ? (
        <>
          <ul>
            {Object.values(
              groupProductsByType<ProductWithTypeAndQuantity>(
                productsWithTypeAndQuantity
              )
            ).map((productTypes) => (
              <div key={productTypes[0].id}>
                <li>{productTypes[0].productType.name}</li>
                <ul>
                  {productTypes.map((product) => (
                    <li key={product.id}>
                      Taille : {product.size} | Prix : {product.price} |
                      {displayQuantity(product)}
                      <button
                        style={{ marginLeft: "10px" }}
                        onClick={() => handleRemoveItemFromCart(product)}
                      >
                        Supprimer du panier
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </ul>
          <p>Total : {new Price(totalPrice).format()} </p>{" "}
          <Elements stripe={stripePromise}>
            <CheckoutForm
              amount={totalPrice}
              receiptEmail={"tommymartin1234@gmail.com"}
            />
          </Elements>
        </>
      ) : (
        <p>
          Le panier est vide. Va{" "}
          <Link href={"shop"}>acheter des trucs 🤑🤑</Link>
        </p>
      )}
    </Layout>
  );
}
