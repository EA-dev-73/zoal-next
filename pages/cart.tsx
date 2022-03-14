import { Layout } from "../components/Layout";
import { getCartContentFromLocalStorage } from "../utils/localStorageHelpers";

export default function Shop() {
  const cartContent = getCartContentFromLocalStorage();
  //TODO
  return (
    <Layout pageTitle="Panier">
      <h1>Contenu du panier</h1>
    </Layout>
  );
}
