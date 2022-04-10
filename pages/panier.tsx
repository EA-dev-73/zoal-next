import { CartRecap } from "../components/CartRecap";
import { Layout } from "../components/Layout";

export default function Panier() {
  return (
    <Layout>
      <h1>Contenu du panier</h1>
      <CartRecap isRecap={false} />
    </Layout>
  );
}
