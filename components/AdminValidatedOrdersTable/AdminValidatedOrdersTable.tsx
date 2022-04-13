import { DataGrid } from "devextreme-react";
import {
  SearchPanel,
  Column,
  Editing,
  RequiredRule,
  FilterRow,
  MasterDetail,
} from "devextreme-react/data-grid";
import { useEffect, useState } from "react";
import { getValidatedOrders } from "../../api/validatedOrders";
import { ValidatedOrder } from "../../types";
import { AdminValidatedOrdersProductsMasterDetail } from "./AdminValidatedOrdersProductsMasterDetail";
import { onRowRemoving, onRowUpdating } from "./lib";

export const AdminValidatedOrdersTable = () => {
  const [validatedOrders, setValidatedOrders] = useState<ValidatedOrder[]>([]);

  useEffect(() => {
    getValidatedOrders().then((res) => setValidatedOrders(res.data || []));
  }, []);

  return (
    <DataGrid
      dataSource={validatedOrders || []}
      //@ts-ignore
      onRowUpdating={onRowUpdating}
      onRowRemoving={onRowRemoving}
    >
      <FilterRow visible />
      <SearchPanel visible />
      <Editing mode="row" allowUpdating allowDeleting />
      <Column dataField="shippingAddress" caption="Addresse de livraison">
        <RequiredRule />
      </Column>
      <Column
        dataField="stripePaymentUrl"
        caption="Lien vers stripe"
        allowEditing={false}
        cellRender={(e) => (
          <a
            target="_blank"
            href={e.row.data.stripePaymentUrl}
            rel="noreferrer"
          >
            {e.row.data.stripePaymentUrl}
          </a>
        )}
      >
        <RequiredRule />
      </Column>
      <Column
        dataField="hasBeenSent"
        caption="Commande envoyée"
        dataType="boolean"
        filterValue={false}
      />
      <Column
        dataType="boolean"
        dataField="isArchived"
        caption="Commande supprimée"
        filterValue={false}
      />
      <MasterDetail
        enabled
        autoExpandAll
        component={(e) => (
          <AdminValidatedOrdersProductsMasterDetail
            orderContent={e.data.data.orderContent}
          />
        )}
      />
    </DataGrid>
  );
};
