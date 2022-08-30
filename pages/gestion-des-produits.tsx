import { AdminProductsTable } from "../components/AdminProductsTable/AdminProductsTable";
import { Layout } from "../components/Layout";

export default function GestionDesProduits() {
  return (
    <Layout needsAuth insideContainer={false}>
      <h1>Gestion des produits</h1>
      <AdminProductsTable />
    </Layout>
  );
}
