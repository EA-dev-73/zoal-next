import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import { AdminProductsTable } from "../components/AdminProductsTable";
import { Layout } from "../components/Layout";
import { userState } from "../context/user";

export default function Admin() {
  const router = useRouter();
  const user = useRecoilValue(userState);

  if (!user?.id) router.replace("/connexion");
  return (
    <Layout>
      <h1>Admin</h1>
      <h3>Gérer les produits</h3>
      <AdminProductsTable />
      <h3>Commandes</h3>
    </Layout>
  );
}
