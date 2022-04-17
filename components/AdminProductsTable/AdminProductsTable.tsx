import { DataGrid, FileUploader } from "devextreme-react";
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

import React, { useRef } from "react";
import { AdminProductsMasterDetail } from "./ProductMasterDetail/AdminProductsMasterDetail";
import {
  onRowInserting,
  onRowRemoving,
  onRowUpdating,
  useProductsForAdminTable,
} from "./lib";
import Image from "next/image";

export const AdminProductsTable = () => {
  const fileUploaderRef = useRef<any>();
  const products = useProductsForAdminTable();
  return (
    <DataGrid
      dataSource={products || []}
      onRowInserting={onRowInserting}
      onRowUpdating={onRowUpdating}
      onRowRemoving={onRowRemoving}
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
          <Item itemType="group" caption="Photo" colCount={2} colSpan={2}>
            <Item dataField="imagesUrl" colSpan={2} />
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
      <Column
        dataField="imagesUrls"
        allowSorting={false}
        caption={"Images"}
        editCellRender={(cellInfo) => {
          return (
            <>
              {cellInfo.data.imagesUrls &&
                cellInfo.data.imagesUrls.map((x: any, idx: number) => (
                  <Image
                    key={idx}
                    className="uploadedImage"
                    src={cellInfo.data.imagesUrl[0]}
                    alt={`image ${idx}`}
                    width={100}
                    height={100}
                  />
                ))}

              <FileUploader
                ref={fileUploaderRef}
                multiple
                accept="image/*"
                uploadMode="useForm"
                // onValueChanged={async ({ value: files }) => {
                //   files && (await uploadProductImagesToBucket(files));
                // }}
                onUploadError={(e) => {
                  console.log("4", e);
                }}
              />
            </>
          );
        }}
      />
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
