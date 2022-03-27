import { DataGrid } from "devextreme-react";
import {
  SearchPanel,
  GroupPanel,
  Column,
  MasterDetail,
  Editing,
  RequiredRule,
} from "devextreme-react/data-grid";
import React, { useEffect, useState } from "react";
import {
  createProductTypeWithCategory,
  fetchProductTypes,
} from "../../api/product";
import { AdminProductsMasterDetail } from "./AdminProductsMasterDetail";
import { FormattedProduct, OnRowInsertingEvent } from "./types";

export const AdminProductsTable = () => {
  const [products, setProducts] = useState([] as FormattedProduct[] | null);
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
    <DataGrid
      dataSource={products || []}
      onRowInserting={async (e: OnRowInsertingEvent) => {
        try {
          await createProductTypeWithCategory({
            createCategoryData: {
              categoryName: e.data.categoryName,
            },
            createProductTypeData: {
              name: e.data.name,
            },
          });
        } catch (error: any) {
          alert(error.message);
        }
      }}
    >
      <SearchPanel visible />
      <GroupPanel visible allowColumnDragging={false} />
      <Editing mode="form" allowUpdating allowAdding allowDeleting />
      <Column dataField="name">
        <RequiredRule />
      </Column>
      <Column
        dataField="categoryName"
        caption={"Catégorie"}
        groupIndex={0}
        autoExpandGroup={false}
      >
        <RequiredRule />
      </Column>
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
