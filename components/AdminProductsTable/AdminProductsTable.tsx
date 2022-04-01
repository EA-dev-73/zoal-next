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
  deleteProductType,
  fetchProductTypes,
} from "../../api/product";
import { AdminProductsMasterDetail } from "./AdminProductsMasterDetail";
import { DisplayProductTypeImages } from "./DisplayProductTypeImages";
import { onRowInserting, onRowRemoving, onRowUpdating } from "./lib";
import {
  FormattedProduct,
  OnRowDeletingEvent,
  OnRowInsertingEvent,
} from "./types";

export const AdminProductsTable = () => {
  const [products, setProducts] = useState<FormattedProduct[] | null>([]);
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
      onRowInserting={onRowInserting}
      onRowUpdating={onRowUpdating}
      onRowRemoving={onRowRemoving}
    >
      <SearchPanel visible />
      <GroupPanel visible allowColumnDragging={false} />
      <Editing mode="form" allowUpdating allowAdding allowDeleting />
      <Column
        dataField="categoryName"
        caption={"Catégorie"}
        groupIndex={0}
        autoExpandGroup={false}
      >
        <RequiredRule />
      </Column>
      <Column dataField="name" caption="Nom du produit">
        <RequiredRule />
      </Column>
      <Column
        dataField="productTypeImage"
        caption={"Images du produit"}
        cellRender={(e) => (
          <DisplayProductTypeImages images={e.data.productTypeImage || []} />
        )}
        allowEditing={false}
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
