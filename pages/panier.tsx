import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fetchProductsFromIds } from "../api/products/product";
import { CheckoutForm } from "../components/StripeCheckoutForm";
import { Product, ProductWithTypeAndQuantity } from "../types";
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
  const [products, setProducts] = useState([] as ProductWithTypeAndQuantity[]);
  const [quantityError, setQuantityError] = useState(true);

  useEffect(() => {
    //TODO refacto
    const localStorageContent = getCartContentFromLocalStorage();
    fetchProductsFromIds(localStorageContent).then((products) => {
      const withQuantity = addQuantityToProducts(products || []);
      setProducts(withQuantity);
      const amountOfProductInLocalStorage = (productId: Product["id"]) =>
        localStorageContent.filter(
          (localStorageId) => localStorageId === productId
        ).length;
      const hasQuantityError = (withQuantity || []).some(
        (product) => product.stock < amountOfProductInLocalStorage(product.id)
      );
      setQuantityError(hasQuantityError);
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
    }
  };

  const totalPrice = calculateTotalPrice(productsWithTypeAndQuantity);

  return (
    <>
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
    </>
  );
}
