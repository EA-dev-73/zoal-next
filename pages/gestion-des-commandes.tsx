import { AdminValidatedOrdersTable } from "../components/AdminValidatedOrdersTable/AdminValidatedOrdersTable";
import { Layout } from "../components/Layout";

export default function GestionDesCommandes() {
  return (
    <Layout needsAuth insideContainer={false}>
      <h1>Gestion des commandes</h1>
      <AdminValidatedOrdersTable />
    </Layout>
  );
}
