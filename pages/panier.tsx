import { groupBy } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fetchProductsFromIds } from "../api/products-api";
import { Layout } from "../components/Layout";
import { Product, ProductWithTypeAndQuantity } from "../types";
import { addQuantityToProducts } from "../utils/addItemsQuantityToProducts";
import { groupProductsByType } from "../utils/groupProductsByType";
import {
  getCartContentFromLocalStorage,
  removeItemFromCart,
} from "../utils/localStorageHelpers";
import { Price } from "../value-objects/Price";

export default function Panier() {
  const router = useRouter();

  const [productsWithQuantity, setProductsWithQuantity] = useState(
    [] as ProductWithTypeAndQuantity[]
  );

  useEffect(() => {
    const localStorageContent = getCartContentFromLocalStorage();
    fetchProductsFromIds(localStorageContent).then((products) => {
      const productsWithItemsQuantity = addQuantityToProducts(products || []);
      setProductsWithQuantity(productsWithItemsQuantity || []);
    });
  }, []);

  const handleRemoveItemFromCart = (itemId: Product["id"]) => {
    removeItemFromCart(itemId);
    router.reload();
  };

  const calculateTotalPrice = (
    productsWithQuantity: ProductWithTypeAndQuantity[]
  ) =>
    productsWithQuantity.reduce((acc, item) => {
      if (item.inStock) return acc + item.price * item.quantity;
      return acc;
    }, 0);

  const isEmptyCart = !Object.values(groupProductsByType(productsWithQuantity))
    ?.length;

  return (
    <Layout pageTitle="Panier">
      <h1>Contenu du panier</h1>
      {!isEmptyCart ? (
        <>
          <ul>
            {Object.values(
              groupProductsByType<ProductWithTypeAndQuantity>(
                productsWithQuantity
              )
            ).map((productTypes) => (
              <>
                <li>{productTypes[0].productType.name}</li>
                <ul>
                  {productTypes.map((product) => (
                    <li key={product.id}>
                      Taille : {product.size} | Prix : {product.price} |
                      Quantité : {product.quantity}
                      {!product.inStock && (
                        <span style={{ color: "red" }}>
                          {" "}
                          (Rupture de stock ⚠️)
                        </span>
                      )}
                      <button
                        style={{ marginLeft: "10px" }}
                        onClick={() => handleRemoveItemFromCart(product.id)}
                      >
                        Supprimer du panier
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            ))}
          </ul>
          <p>
            Total :{" "}
            {new Price(calculateTotalPrice(productsWithQuantity)).format()}{" "}
          </p>{" "}
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
