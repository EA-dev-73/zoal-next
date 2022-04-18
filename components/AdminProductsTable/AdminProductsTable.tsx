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

import React, { useRef, useState } from "react";
import { AdminProductsMasterDetail } from "./ProductMasterDetail/AdminProductsMasterDetail";
import {
  onRowInserting,
  onRowRemoving,
  onRowUpdating,
  ProductForAdminTable,
  useProductsForAdminTable,
} from "./lib";
import { DisplayCurrentProductImages } from "./DisplayCurrentProductPictures";

export const AdminProductsTable = () => {
  const fileUploaderRef = useRef<HTMLInputElement>(null);
  const products = useProductsForAdminTable();
  const [currentlyEditingProduct, setCurrentlyEditingProduct] =
    useState<ProductForAdminTable | null>(null);
  return (
    <DataGrid
      dataSource={products || []}
      onRowInserting={(e) =>
        onRowInserting(
          e,
          fileUploaderRef?.current?.files || ([] as unknown as FileList)
        )
      }
      onRowUpdating={onRowUpdating}
      onRowRemoving={onRowRemoving}
      onEditingStart={(p) => setCurrentlyEditingProduct(p.data)}
    >
      <SearchPanel visible />
      <GroupPanel visible allowColumnDragging={false} />
      <Editing mode="popup" allowUpdating allowAdding allowDeleting>
        <Form>
          <Popup title="Produit" showTitle width={700} />
          <Item itemType="group" colCount={2} colSpan={2}>
            <Item dataField="name" />
            <Item dataField="categoryName" />
          </Item>
          <Item itemType="group" caption="Images" colCount={2} colSpan={2}>
            <input
              type="file"
              ref={fileUploaderRef}
              className="my-3"
              multiple
            />
            <DisplayCurrentProductImages
              imagesUrls={currentlyEditingProduct?.imagesUrls || []}
            />
          </Item>
        </Form>
      </Editing>

      <Column
        dataField="categoryName"
        caption={"Catégorie"}
        groupIndex={0}
        autoExpandGroup={false}
      />
      <Column
        dataField="imagesUrls"
        caption={"Images"}
        cellRender={(e) => {
          return (
            <DisplayCurrentProductImages
              imagesUrls={e.data.imagesUrls}
              isEdit={false}
            />
          );
        }}
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
  );
};
