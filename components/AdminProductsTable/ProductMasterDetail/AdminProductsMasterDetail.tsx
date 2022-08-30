import { DataGrid } from "devextreme-react";
import { Column, Editing, RequiredRule } from "devextreme-react/data-grid";
import { Product, ProductType } from "../../../types";
import { useOnRowInserting } from "./hooks/useOnRowInserting";
import { useOnRowRemoving } from "./hooks/useOnRowRemoving";
import { useOnRowUpdating } from "./hooks/useOnRowUpdating";

type Props = {
  products: Product[];
  productTypeId: ProductType["id"];
};

export const AdminProductsMasterDetail = ({
  products,
  productTypeId,
}: Props) => {
  const { onRowInserting } = useOnRowInserting();
  const { onRowUpdating } = useOnRowUpdating();
  const { onRowRemoving } = useOnRowRemoving();
  return (
    <DataGrid
      dataSource={products || []}
      onRowInserting={(e) => onRowInserting(e, productTypeId)}
      onRowUpdating={(e) => onRowUpdating(e, productTypeId)}
      onRowRemoving={(e) => onRowRemoving(e.data.id)}
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
