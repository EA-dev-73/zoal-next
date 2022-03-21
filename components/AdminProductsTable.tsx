import { DataGrid } from "devextreme-react";
import {
  SearchPanel,
  GroupPanel,
  Column,
  MasterDetail,
} from "devextreme-react/data-grid";
import React, { useEffect, useState } from "react";
import { fetchProductTypes } from "../api/products-api";
import { ProductType } from "../types";
import { AdminProductsMasterDetail } from "./AdminProductsMasterDetail";

export const AdminProductsTable = () => {
  const [products, setProducts] = useState([] as ProductType[] | null);
  useEffect(() => {
    fetchProductTypes().then((products) => {
      const formattedProducts = (products || []).map((product) => ({
        ...product,
        categoryName: product.productCategory.name,
      }));
      setProducts(formattedProducts);
    });
  }, []);
  return (
    <DataGrid dataSource={products || []}>
      <SearchPanel visible />
      <GroupPanel visible allowColumnDragging={false} />
      <Column dataField="name" />
      <Column
        dataField="categoryName"
        caption={"Catégorie"}
        groupIndex={0}
        autoExpandGroup={false}
      />
      <MasterDetail
        enabled
        component={({
          data: {
            data: { products },
          },
        }) => <AdminProductsMasterDetail products={products} />}
      />
    </DataGrid>
  );
};
