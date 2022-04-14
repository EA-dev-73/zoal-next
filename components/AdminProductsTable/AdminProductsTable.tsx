import { Button, DataGrid, FileUploader } from "devextreme-react";
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

import React, { useEffect, useRef, useState } from "react";
import { fetchProductTypes } from "../../api/products/product-type";
import { AdminProductsMasterDetail } from "./ProductMasterDetail/AdminProductsMasterDetail";
import { DisplayProductTypeImages } from "./DisplayProductTypeImages";
import { onRowInserting, onRowRemoving, onRowUpdating } from "./lib";
import { FormattedProduct } from "./types";
import Image from "next/image";

export const AdminProductsTable = () => {
  const [products, setProducts] = useState<FormattedProduct[] | null>([]);
  const fileUploaderRef = useRef<any>();
  useEffect(() => {
    fetchProductTypes().then((products) => {
      const formattedProducts = (products || []).map((product) => ({
        ...product,
        categoryName: product.productCategory.name,
        //traitement particulier sur les images pour pouvoir les éditer plus facilement
        imagesUrl: product.productTypeImage.map((x) => x.imageUrl),
      }));
      setProducts(formattedProducts);
    });
  }, []);

  return (
    <DataGrid
      dataSource={products || []}
      onRowInserting={onRowInserting}
      //@ts-ignore
      onRowUpdating={onRowUpdating}
      onRowRemoving={onRowRemoving}
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
        dataField="imagesUrl"
        allowSorting={false}
        caption={"Images du produit (entre ,)"}
        cellRender={(e) => (
          <DisplayProductTypeImages imagesUrl={e.data.imagesUrl || []} />
        )}
        editCellRender={(cellInfo) => (
          <>
            <Image
              className="uploadedImage"
              src={cellInfo.data.imagesUrl[0]}
              alt="employee pic"
              width={100}
              height={100}
            />
            <FileUploader
              ref={fileUploaderRef}
              multiple={false}
              accept="image/*"
              uploadMode="instantly"
              uploadUrl=""
              onValueChanged={() => {}}
              onUploaded={(e) => {}}
              onUploadError={() => {}}
            />
            <Button
              className={"retryButton"}
              text="Retry"
              visible={true}
              onClick={() => {}}
            />
          </>
        )}
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
