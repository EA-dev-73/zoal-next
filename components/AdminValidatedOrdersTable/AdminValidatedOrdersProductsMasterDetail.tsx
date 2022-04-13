import { DataGrid } from "devextreme-react";
import { Column } from "devextreme-react/data-grid";
import React, { useEffect, useState } from "react";
import { fetchProductWithTypeDataAndCategory } from "../../api/products/product";
import { Product } from "../../types";

export const AdminValidatedOrdersProductsMasterDetail = ({
  orderContent,
}: {
  orderContent: string;
}) => {
  const [products, setProducts] = useState<Product[] | null>([]);
  const parsed = JSON.parse(orderContent);

  useEffect(() => {
    fetchProductWithTypeDataAndCategory(
      parsed.map((x: any) => x.productId)
    ).then((p) => {
      console.log({ p });
      setProducts(
        parsed.map((x: any) => ({
          ...x,
          productName: (p || []).find((x) => x.id === x.id)?.name,
          productCategory: (p || []).find((x) => x.id === x.id)?.productCategory
            .name,
        }))
      );
    });
  }, []);

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
