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
import { DisplayCurrentProductImages } from "./DisplayCurrentProductPictures";
import { useProductsForAdminTable } from "./hooks/useProductsForAdminTable";
import { ProductForAdminTable, ProductType } from "../../types";
import {
  useOnRowImageUpdating,
  useOnRowUpdating,
} from "./hooks/useOnRowUpdating";
import { useOnRowInserting } from "./hooks/useOnRowInserting";
import { useOnRowRemoving } from "./hooks/useOnRowRemoving";

export const AdminProductsTable = () => {
  const fileUploaderRef = useRef<HTMLInputElement>(null);
  const { products, isLoading } = useProductsForAdminTable();
  const [currentlyEditingProductType, setCurrentlyEditingProductType] =
    useState<ProductForAdminTable | null>(null);

  const [productTypeIdToDelete, setProductTypeIdToDelete] =
    useState<ProductType["id"]>();

  const { onRowUpdating } = useOnRowUpdating();
  const { onRowInserting } = useOnRowInserting();
  const { onRowRemoving } = useOnRowRemoving(
    productTypeIdToDelete as ProductType["id"]
  );
  const { onRowImageUpdating } = useOnRowImageUpdating();

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
        onRowUpdating={(e) => {
          console.log({ fileRef: fileUploaderRef?.current });
          return onRowUpdating(
            e,
            fileUploaderRef?.current?.files || ([] as unknown as FileList)
          );
        }}
        onRowRemoving={async (e) => {
          const productTypeId = e.data.id;
          setProductTypeIdToDelete(productTypeId);
          await onRowRemoving(e);
        }}
        onEditingStart={(p) => {
          setCurrentlyEditingProductType(p.data);
          const rowIdx = p.component.getRowIndexByKey(p.key);
          p.component.cellValue(rowIdx, "imagesUrls", "tmp");
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
            <Item
              itemType="group"
              caption="Images"
              colCount={2}
              colSpan={2}
              render={() => (
                <>
                  <input
                    type="file"
                    ref={fileUploaderRef}
                    className="my-3"
                    multiple
                    onChange={() => {
                      console.log("inside imageref onchange ");
                      if (!currentlyEditingProductType?.id) return;
                      onRowImageUpdating({
                        images:
                          fileUploaderRef?.current?.files ||
                          ([] as unknown as FileList),
                        productTypeId: currentlyEditingProductType.id,
                      });
                    }}
                  />
                  <DisplayCurrentProductImages
                    productTypeId={currentlyEditingProductType?.id}
                    imagesUrls={currentlyEditingProductType?.imagesUrls || []}
                  />
                </>
              )}
            ></Item>
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
                key={e.data.imagesUrls.length}
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
