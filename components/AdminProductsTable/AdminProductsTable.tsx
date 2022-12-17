import { DataGrid } from "devextreme-react";
import {
  SearchPanel,
  GroupPanel,
  Column,
  MasterDetail,
  Editing,
  Popup,
  Form,
} from "devextreme-react/data-grid";
import { Item } from "devextreme-react/form";

import React, { useState } from "react";
import { AdminProductsMasterDetail } from "./ProductMasterDetail/AdminProductsMasterDetail";
import { useProductsForAdminTable } from "./hooks/useProductsForAdminTable";
import { ProductForAdminTable, ProductType } from "../../types";
import { useOnRowUpdating } from "./hooks/useOnRowUpdating";
import { useOnRowInserting } from "./hooks/useOnRowInserting";
import { useOnRowRemoving } from "./hooks/useOnRowRemoving";

export const AdminProductsTable = () => {
  const { products, isLoading } = useProductsForAdminTable();

  const [productTypeIdToDelete, setProductTypeIdToDelete] =
    useState<ProductType["id"]>();

  const { onRowUpdating } = useOnRowUpdating();
  const { onRowInserting } = useOnRowInserting();
  const { onRowRemoving } = useOnRowRemoving(
    productTypeIdToDelete as ProductType["id"]
  );

  if (isLoading) {
    return <p>Chargement des produits...</p>;
  }

  return (
    <>
      <DataGrid
        dataSource={products || []}
        onRowInserting={(e) => onRowInserting(e)}
        onRowUpdating={(e) => {
          return onRowUpdating(e);
        }}
        onRowRemoving={async (e) => {
          const productTypeId = e.data.id;
          setProductTypeIdToDelete(productTypeId);
          await onRowRemoving(e);
        }}
      >
        <SearchPanel visible />
        <GroupPanel visible allowColumnDragging={false} />
        <Editing mode="form" allowUpdating allowAdding allowDeleting>
          <Form>
            <Popup title="Produit" showTitle width={700} />
            <Item itemType="group" colCount={2} colSpan={2}>
              <Item dataField="name" />
              <Item dataField="categoryName" />
            </Item>
          </Form>
        </Editing>

        <Column
          dataField="categoryName"
          caption={"Catégorie"}
          groupIndex={0}
          autoExpandGroup={false}
        />
        <Column dataField="name" caption="Nom du produit" />
        <MasterDetail
          enabled
          component={({
            data: {
              data: { products, id: productTypeId },
            },
          }) => (
            <AdminProductsMasterDetail
              products={products}
              productTypeId={productTypeId}
            />
          )}
        />
      </DataGrid>
    </>
  );
};
