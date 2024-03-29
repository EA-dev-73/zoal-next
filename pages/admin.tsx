import Link from "next/link";
import { Layout } from "../components/Layout";

export default function Admin() {
  return (
    <Layout needsAuth>
      <h1>Admin</h1>
      <Link href="/gestion-des-produits">Gestion des produits</Link>
      <br />
      <Link href="/gestion-des-commandes">Gestion des commandes</Link>
      <br />
      <Link href="/gestion-des-images">Gestion des images</Link>
    </Layout>
  );
}
