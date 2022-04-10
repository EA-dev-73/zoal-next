import { DataGrid } from "devextreme-react";
import { Column, Editing, RequiredRule } from "devextreme-react/data-grid";
import { useRouter } from "next/router";
import { Product, ProductType } from "../../../types";
import { onRowInserting, onRowRemoving, onRowUpdating } from "./lib";

type Props = {
  products: Product[];
  productTypeId: ProductType["id"];
};

export const AdminProductsMasterDetail = ({
  products,
  productTypeId,
}: Props) => {
  const router = useRouter();
  return (
    <DataGrid
      dataSource={products || []}
      onRowInserting={(e) => onRowInserting(e, productTypeId)}
      onRowUpdating={(e) => onRowUpdating(e, productTypeId)}
      onRowRemoving={(e) => onRowRemoving(e.data.id)}
      //TODO moche mais wip
      onSaved={() => router.reload()}
    >
      <Editing mode="batch" allowUpdating allowAdding allowDeleting />
      <Column dataField="size" caption="Taille">
        <RequiredRule />
      </Column>
      <Column dataField="price" caption="Prix (en €)">
        <RequiredRule />
      </Column>
      <Column dataField="stock" caption="Quantité en stock">
        <RequiredRule />
      </Column>
      <Column dataField="shippingFees" caption="Frais de ports (en €)">
        <RequiredRule />
      </Column>
    </DataGrid>
  );
};
