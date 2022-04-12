import { DataGrid } from "devextreme-react";
import {
  SearchPanel,
  Column,
  Editing,
  RequiredRule,
} from "devextreme-react/data-grid";
import { useEffect, useState } from "react";
import { getValidatedOrders } from "../../api/validatedOrders";
import { ValidatedOrder } from "../../types";

export const AdminValidatedOrdersTable = () => {
  const [validatedOrders, setValidatedOrders] = useState<ValidatedOrder[]>([]);

  useEffect(() => {
    getValidatedOrders().then((res) => setValidatedOrders(res.data || []));
  }, []);

  return (
    <DataGrid dataSource={validatedOrders || []}>
      <SearchPanel visible />
      <Editing mode="form" allowUpdating allowAdding allowDeleting />
      <Column
        dataField="orderContent"
        caption={"Contenu"}
        autoExpandGroup={false}
      >
        <RequiredRule />
      </Column>
      <Column dataField="shippingAddress" caption="Addresse de livraison">
        <RequiredRule />
      </Column>
      <Column
        dataField="stripePaymentUrl"
        caption="Lien vers stripe"
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
      <Column dataField="hasBeenSent" caption="Commande envoyée">
        <RequiredRule />
      </Column>
      <Column dataField="isArchived" caption="Commande supprimée">
        <RequiredRule />
      </Column>
    </DataGrid>
  );
};
