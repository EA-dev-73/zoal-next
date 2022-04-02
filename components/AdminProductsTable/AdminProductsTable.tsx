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
import { fetchProductTypes } from "../../api/product";
import { AdminProductsMasterDetail } from "./AdminProductsMasterDetail";
import { DisplayProductTypeImages } from "./DisplayProductTypeImages";
import { onRowInserting, onRowRemoving, onRowUpdating } from "./lib";
import { FormattedProduct } from "./types";

export const AdminProductsTable = () => {
  const [products, setProducts] = useState<FormattedProduct[] | null>([]);
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
        dataField="imagesUrl"
        caption={"Images du produit (entre ,)"}
        cellRender={(e) => (
          <DisplayProductTypeImages imagesUrl={e.data.imagesUrl || []} />
        )}
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
