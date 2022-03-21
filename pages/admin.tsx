import { AdminProductsTable } from "../components/AdminProductsTable";
import { Layout } from "../components/Layout";

export default function Admin() {
  return (
    <Layout>
      <h1>Admin</h1>
      <h3>Gérer les produits</h3>
      <AdminProductsTable />
      <h3>Commandes</h3>
    </Layout>
  );
}
