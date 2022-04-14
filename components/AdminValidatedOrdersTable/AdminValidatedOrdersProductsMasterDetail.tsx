import { DataGrid } from "devextreme-react";
import { Column } from "devextreme-react/data-grid";
import React, { useEffect, useState } from "react";
import { fetchProductWithTypeDataAndCategory } from "../../api/products/product";
import { Category, Product, ProductType } from "../../types";
import { formatStripeProductsForMasterDetail } from "./lib";

export type StripeProduct = {
  price: Product["price"];
  productId: Product["id"];
  productTypeId: ProductType["id"];
  quantity: number;
  size: Product["size"];
};

export type ValidatedOrderMasterDetailProduct = {
  productName: ProductType["name"];
  productCategory: Category["name"];
  size: Product["size"];
  quantity: StripeProduct["quantity"];
};

export const AdminValidatedOrdersProductsMasterDetail = ({
  orderContent,
}: {
  orderContent: string;
}) => {
  const [products, setProducts] = useState<
    ValidatedOrderMasterDetailProduct[] | null
  >([]);
  const stripeProducts: StripeProduct[] = JSON.parse(orderContent);

  useEffect(() => {
    fetchProductWithTypeDataAndCategory(
      stripeProducts.map((x: any) => x.productId)
    ).then((databaseProductTypes) => {
      const formattedForMasterDetail = formatStripeProductsForMasterDetail(
        stripeProducts,
        databaseProductTypes
      );
      setProducts(formattedForMasterDetail);
    });
  }, [stripeProducts]);

  return (
    <DataGrid dataSource={products || []}>
      <Column
        dataField="productId"
        caption="Produit (catégorie)"
        calculateDisplayValue={(e: any) =>
          `${e.productName} (${e.productCategory})`
        }
        alignment="center"
      />
      <Column dataField="size" caption="Taille" />
      <Column dataField="quantity" caption="Quantité" />
    </DataGrid>
  );
};
