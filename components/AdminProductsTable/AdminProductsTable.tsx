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
  onRowRemoving,
  ProductForAdminTable,
  useOnRowInserting,
  useOnRowUpdating,
  useProductsForAdminTable,
} from "./lib";
import { DisplayCurrentProductImages } from "./DisplayCurrentProductPictures";
import { useRouter } from "next/router";

export const AdminProductsTable = () => {
  const router = useRouter();
  const fileUploaderRef = useRef<HTMLInputElement>(null);
  const { products, isLoading } = useProductsForAdminTable();
  const [currentlyEditingProductType, setCurrentlyEditingProductType] =
    useState<ProductForAdminTable | null>(null);

  const { onRowUpdating } = useOnRowUpdating();
  const { onRowInserting } = useOnRowInserting();

  if (isLoading) {
    return <p>Chargement des produits...</p>;
  }

  return (
    <>
      <DataGrid
        dataSource={products || []}
        onRowInserting={(e) =>
          onRowInserting(
            e,
            fileUploaderRef?.current?.files || ([] as unknown as FileList)
          )
        }
        onRowUpdating={(e) =>
          onRowUpdating(
            e,
            fileUploaderRef?.current?.files || ([] as unknown as FileList)
          )
        }
        onRowRemoving={async (e) => {
          await onRowRemoving(e);
          router.reload();
        }}
        onEditingStart={(p) => {
          //@ts-ignore
          setCurrentlyEditingProductType(p.data);
          const rowIdx = p.component.getRowIndexByKey(p.key);
          p.component.cellValue(rowIdx, "imagesUrls", "tmp");
        }}
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
                productTypeId={currentlyEditingProductType?.id}
                imagesUrls={currentlyEditingProductType?.imagesUrls || []}
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
                productTypeId={e.data.id}
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
    </>
  );
};
