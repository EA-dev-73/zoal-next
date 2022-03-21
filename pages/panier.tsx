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
  const [quantityError, setQuantityError] = useState(true);

  useEffect(() => {
    const localStorageContent = getCartContentFromLocalStorage();
    fetchProductsFromIds(localStorageContent).then((products) => {
      setProducts(products || []);
    });
  }, []);

  const handleRemoveItemFromCart = (product: Product) => {
    removeItemFromCart(product.id, product.stock);
    router.reload();
  };

  const calculateTotalPrice = (
    productsWithQuantity: ProductWithTypeAndQuantity[]
  ) =>
    productsWithQuantity.reduce((acc, item) => {
      if (item.stock > 0) return acc + item.price * item.quantity;
      return acc;
    }, 0);

  const isEmptyCart = !Object.values(groupProductsByType(products))?.length;

  const productsWithTypeAndQuantity = addQuantityToProducts(products || []);

  const displayQuantity = (product: ProductWithTypeAndQuantity) => {
    if (product.stock < 1) {
      return <span style={{ color: "red" }}> | En Rupture de stock ⚠️ </span>;
    } else if (product.stock < product.quantity) {
      return (
        <span style={{ color: "red" }}>
          | Pas assez de stock ({product.stock}){" "}
        </span>
      );
    } else {
      if (quantityError) {
        setQuantityError(false);
      }
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
                      Taille : {product.size} | Prix unitaire : {product.price}{" "}
                      | Quantité souhaitée : {product.quantity}{" "}
                      {displayQuantity(product)}
                      <button
                        style={{ marginLeft: "10px" }}
                        onClick={() => handleRemoveItemFromCart(product)}
                      >
                        Supprimer 1 article du panier
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
              quantityError={quantityError}
            />
          </Elements>
        </>
      ) : (
        <p>
          Le panier est vide. Va{" "}
          <Link href={"/shop"}>acheter des trucs 🤑🤑</Link>
        </p>
      )}
    </Layout>
  );
}
