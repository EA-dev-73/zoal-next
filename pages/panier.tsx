import { groupBy } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fetchProductsFromIds } from "../api/products-api";
import { Layout } from "../components/Layout";
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
              <>
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
              </>
            ))}
          </ul>
          <p>
            Total :{" "}
            {new Price(
              calculateTotalPrice(productsWithTypeAndQuantity)
            ).format()}{" "}
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
