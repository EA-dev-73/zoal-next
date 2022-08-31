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
import { infoIcon } from "../../utils/icons";
import { AdminValidatedOrdersProductsMasterDetail } from "./AdminValidatedOrdersProductsMasterDetail";
import { onRowRemoving, onRowUpdating } from "./lib";

export const AdminValidatedOrdersTable = () => {
  const [validatedOrders, setValidatedOrders] = useState<ValidatedOrder[]>([]);

  useEffect(() => {
    getValidatedOrders().then((res) => setValidatedOrders(res.data || []));
  }, []);

  return (
    <>
      <p className="text-center">
        {infoIcon} Par défault ne sont affichées que les commandes{" "}
        <strong>non envoyées</strong> et <strong>non supprimées</strong>
      </p>
      <p className="text-center">Les filtres sont modifiables dans la table</p>
      <DataGrid
        dataSource={validatedOrders || []}
        //@ts-ignore
        onRowUpdating={onRowUpdating}
        onRowRemoving={onRowRemoving}
      >
        <FilterRow visible />
        <SearchPanel visible />
        <Editing mode="row" allowUpdating allowDeleting />
        <Column
          dataField="created_at"
          caption="Date de la commande"
          allowEditing={false}
          sortOrder="asc"
          calculateDisplayValue={({ created_at }: { created_at: Date }) => {
            return new Intl.DateTimeFormat("fr-FR", {
              dateStyle: "medium",
              timeStyle: "medium",
            }).format(new Date(created_at));
          }}
        >
          <RequiredRule />
        </Column>
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
              Voir la commande
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
    </>
  );
};
