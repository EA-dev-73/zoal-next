import { DataGrid } from "devextreme-react";
import { Column, Editing } from "devextreme-react/data-grid";
import { Product } from "../../types";

type Props = {
  products: Product[];
};

export const AdminProductsMasterDetail = ({ products }: Props) => {
  return (
    <DataGrid dataSource={products || []}>
      <Editing mode="batch" allowUpdating allowAdding allowDeleting />
      <Column dataField="size" />
      <Column dataField="price" />
      <Column dataField="stock" />
    </DataGrid>
  );
};
